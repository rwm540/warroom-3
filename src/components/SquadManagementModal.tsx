import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  User as UserIcon,
  Phone,
  IdCard,
  Calendar
} from 'lucide-react';
import { Group, GroupJoinRequest, SquadRank, User } from '../types';
import { confirmInternal } from '../lib/appDialog';
import { validateNationalCode, validatePhoneNumber, validateJalaliDate, generatePersonalCode } from '../utils/jalali';
import { apiCheckNationalCodeExists } from '../lib/backendApi';
import { isSupabaseEnabled, saveUserProgressToSupabase, sha256Hex } from '../lib/supabaseData';
import PersianDatePicker from './PersianDatePicker';

interface SquadManagementModalProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  groupJoinRequests: GroupJoinRequest[];
  setGroupJoinRequests: React.Dispatch<React.SetStateAction<GroupJoinRequest[]>>;
  onClose: () => void;
  triggerAlert: (msg: string) => void;
}

export default function SquadManagementModal({
  currentUser,
  users,
  setUsers,
  groups,
  setGroups,
  groupJoinRequests,
  setGroupJoinRequests,
  onClose,
  triggerAlert
}: SquadManagementModalProps) {
  // Find group
  const userGroup = groups.find(g => g.id === currentUser.group_id);
  const squadMembers = users.filter(u => u.group_id === currentUser.group_id);
  const isLeader = currentUser.role === 'leader' || userGroup?.leader_id === currentUser.id;
  const incomingRequests = groupJoinRequests.filter(request => request.target_group_id === currentUser.group_id && request.status === 'pending');
  const outgoingRequests = groupJoinRequests.filter(request => request.requester_id === currentUser.id && request.status === 'pending');

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: true } }));
    return () => {
      window.dispatchEvent(new CustomEvent('warroom_modal_active_change', { detail: { active: false } }));
    };
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Add / Edit Member form state
  const [memberForm, setMemberForm] = useState({
    first_name: '',
    last_name: '',
    national_code: '',
    phone: '',
    grade: currentUser.grade || 'یازدهم',
    birth_date: '1386/05/15',
    password: '',
    squad_rank: 'soldier' as SquadRank
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestToJoinGroup = (targetGroup: Group) => {
    if (!currentUser.group_id || targetGroup.id === currentUser.group_id || outgoingRequests.some(request => request.target_group_id === targetGroup.id)) return;
    const request: GroupJoinRequest = {
      id: `join_${currentUser.id}_${targetGroup.id}_${Date.now()}`,
      source_group_id: currentUser.group_id,
      target_group_id: targetGroup.id,
      requester_id: currentUser.id,
      requester_name: `${currentUser.first_name} ${currentUser.last_name}`,
      target_group_name: targetGroup.name,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setGroupJoinRequests(prev => [request, ...prev]);
    triggerAlert(`درخواست عضویت برای «${targetGroup.name}» ارسال شد.`);
  };

  const resolveJoinRequest = (request: GroupJoinRequest, status: 'accepted' | 'rejected') => {
    if (!isLeader || request.target_group_id !== currentUser.group_id) return;
    setGroupJoinRequests(prev => prev.map(item => item.id === request.id ? { ...item, status, resolved_at: new Date().toISOString(), resolved_by: currentUser.id } : item));
    if (status === 'accepted') {
      const sourceGroupId = request.source_group_id;
      const sourceGroup = groups.find(group => group.id === sourceGroupId);
      const sourceMembers = users.filter(user => user.group_id === sourceGroupId);
      if (sourceGroupId && sourceGroup && userGroup) {
        setUsers(prev => prev.map(user => user.group_id === sourceGroupId ? { ...user, group_id: userGroup.id, squad_rank: user.id === sourceGroup.leader_id ? 'jokhedar' : (user.squad_rank || 'soldier') } : user));
        setGroups(prev => prev.map(group => {
          if (group.id === userGroup.id) {
            const memberIds = Array.from(new Set([...(group.member_ids || []), ...sourceMembers.map(member => member.id)]));
            return { ...group, members_count: memberIds.length, member_ids: memberIds };
          }
          if (group.id === sourceGroupId) return { ...group, members_count: 0, member_ids: [], parent_group_id: userGroup.id, status: 'merged' };
          return group;
        }));
        triggerAlert(`جوخه «${sourceGroup.name}» زیرمجموعه جوخه «${userGroup.name}» شد و اعضا به اتاق مشترک منتقل شدند.`);
      }
    } else {
      triggerAlert(`درخواست «${request.requester_name}» رد شد.`);
    }
  };

  // Submit Add or Edit Member
  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!memberForm.first_name || !memberForm.last_name) {
      setErrorMsg('لطفاً نام و نام خانوادگی عضو جدید را وارد نمایید.');
      return;
    }

    if (!validateNationalCode(memberForm.national_code)) {
      setErrorMsg('کد ملی ۱۰ رقمی وارد شده معتبر نیست.');
      return;
    }

    if (!editingUserId) {
      const isDuplicate = await apiCheckNationalCodeExists(memberForm.national_code);
      if (isDuplicate) {
        setErrorMsg('این کد ملی قبلاً در سامانه ثبت شده است.');
        return;
      }
    }

    if (!validatePhoneNumber(memberForm.phone)) {
      setErrorMsg('شماره موبایل ۱۱ رقمی معتبر نیست.');
      return;
    }

    if (!validateJalaliDate(memberForm.birth_date)) {
      setErrorMsg('تاریخ تولد شمسی معتبر نیست.');
      return;
    }

    if (editingUserId) {
      // Edit existing member
      const existingMember = users.find(user => user.id === editingUserId);
      if (!existingMember) {
        setErrorMsg('حساب نیروی انتخاب‌شده پیدا نشد.');
        return;
      }
      const updatedMember: User = {
        ...existingMember,
        ...memberForm,
        password: memberForm.password ? await sha256Hex(memberForm.password) : existingMember.password,
        role: memberForm.squad_rank === 'commander' ? 'leader' : memberForm.squad_rank === 'soldier' ? 'member' : 'user'
      };
      setUsers(prev => prev.map(user => user.id === editingUserId ? updatedMember : user));
      const updateSaved = await saveUserProgressToSupabase(updatedMember);
      if (isSupabaseEnabled && !updateSaved) {
        setErrorMsg('ذخیره حساب نیرو در پایگاه داده انجام نشد. اتصال سامانه را بررسی کنید.');
        return;
      }
      triggerAlert(`اطلاعات رزمنده "${memberForm.first_name} ${memberForm.last_name}" به‌روزرسانی شد.`);
      setEditingUserId(null);
    } else {
      // Add new member (check max 6 limit)
      if (squadMembers.length >= 6) {
        setErrorMsg('سقف اعضای جوخه (حداکثر ۶ نفر) تکمیل است.');
        return;
      }

      const newMember: User = {
        id: `u-mem-${Date.now()}`,
        first_name: memberForm.first_name,
        last_name: memberForm.last_name,
        national_code: memberForm.national_code,
        phone: memberForm.phone,
        password: await sha256Hex(memberForm.password),
        role: memberForm.squad_rank === 'commander' ? 'leader' : memberForm.squad_rank === 'soldier' ? 'member' : 'user',
        education_level: currentUser.education_level,
        grade: memberForm.grade,
        gender: currentUser.gender,
        province: currentUser.province,
        city: currentUser.city,
        birth_date: memberForm.birth_date,
        school_name: currentUser.school_name,
        personal_code: generatePersonalCode(),
        group_id: currentUser.group_id,
        squad_rank: memberForm.squad_rank
      };

      setUsers(prev => [...prev, newMember]);
      const accountSaved = await saveUserProgressToSupabase(newMember);
      if (isSupabaseEnabled && !accountSaved) {
        setErrorMsg('حساب نیرو در پایگاه داده ذخیره نشد و قابل ورود نیست. دوباره تلاش کنید.');
        setUsers(prev => prev.filter(user => user.id !== newMember.id));
        return;
      }
      
      // Update group members count
      if (userGroup) {
        setGroups(prev => prev.map(g => 
          g.id === userGroup.id ? { ...g, members_count: g.members_count + 1 } : g
        ));
      }

      triggerAlert(`رزمنده جدید "${newMember.first_name} ${newMember.last_name}" با کد اختصاصی ${newMember.personal_code} به جوخه اضافه شد.`);
    }

    setMemberForm({
      first_name: '',
      last_name: '',
      national_code: '',
      phone: '',
      grade: currentUser.grade || 'یازدهم',
      birth_date: '1386/05/15',
      password: '',
      squad_rank: 'soldier'
    });
    setShowAddForm(false);
  };

  // Remove member handler
  const handleRemoveMember = (member: User) => {
    if (member.role === 'leader') {
      triggerAlert('امکان حذف فرمانده جوخه وجود ندارد.');
      return;
    }

    confirmInternal(`آیا از حذف رزمنده "${member.first_name} ${member.last_name}" از جوخه اطمینان دارید؟`, {
      title: 'حذف عضو از جوخه',
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== member.id));
        if (userGroup) {
          setGroups(prev => prev.map(g => 
            g.id === userGroup.id ? { ...g, members_count: Math.max(1, g.members_count - 1) } : g
          ));
        }
        triggerAlert(`رزمنده "${member.first_name} ${member.last_name}" از جوخه حذف شد.`);
      }
    });
  };

  // Start edit member
  const handleStartEdit = (member: User) => {
    setEditingUserId(member.id);
    setMemberForm({
      first_name: member.first_name,
      last_name: member.last_name,
      national_code: member.national_code,
      phone: member.phone,
      grade: member.grade,
      birth_date: member.birth_date,
      password: '',
      squad_rank: member.squad_rank || (member.role === 'leader' ? 'commander' : 'soldier')
    });
    setShowAddForm(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
      <div className="bg-[#080c1d] border border-red-900/80 rounded-3xl w-full max-w-2xl p-4 sm:p-6 space-y-5 shadow-2xl max-h-[85vh] sm:max-h-[88vh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users size={22} className="text-red-400" />
            <h3 className="text-base font-black text-white">
              مدیریت رزمندگان جوخه: <span className="text-red-400">{userGroup?.name || 'جوخه عملیاتی'}</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Squad Info Banner */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold">

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 space-y-2">
                      <h4 className="text-xs font-black text-cyan-300">پیوستن به گروه دیگر</h4>
                      <p className="text-[10px] leading-5 text-slate-400">بدون پذیرش سرگروه، گروه و روم شما تغییر نمی‌کند.</p>
                      <div className="max-h-28 space-y-1 overflow-y-auto">
                        {groups.filter(group => group.id !== currentUser.group_id).map(group => (
                          <button key={group.id} type="button" onClick={() => requestToJoinGroup(group)} disabled={outgoingRequests.some(request => request.target_group_id === group.id)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-right text-[10px] text-slate-200 disabled:cursor-not-allowed disabled:opacity-50">{group.name} <span className="text-slate-500">({group.members_count}/{group.max_members || 4})</span></button>
                        ))}
                      </div>
                    </div>
                    {isLeader && <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2"><h4 className="text-xs font-black text-amber-300">درخواست‌های عضویت</h4>{incomingRequests.length === 0 ? <p className="text-[10px] text-slate-500">درخواست جدیدی نیست.</p> : incomingRequests.map(request => <div key={request.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2"><span className="text-[10px] text-slate-200">{request.requester_name}</span><span className="flex gap-1"><button type="button" onClick={() => resolveJoinRequest(request, 'accepted')} className="rounded bg-emerald-600 p-1 text-white"><Check size={12} /></button><button type="button" onClick={() => resolveJoinRequest(request, 'rejected')} className="rounded bg-rose-700 p-1 text-white"><X size={12} /></button></span></div>)}</div>}
                  </div>
          <span className="text-slate-300">
            تعداد اعضای فعلی: <span className="text-red-400 font-mono text-sm">{squadMembers.length}</span> از حداکثر ۶ نفر
          </span>
          {isLeader && squadMembers.length < 6 && (
            <button
              onClick={() => {
                setEditingUserId(null);
                setMemberForm({
                  first_name: '',
                  last_name: '',
                  national_code: '',
                  phone: '',
                  grade: currentUser.grade || 'یازدهم',
                  birth_date: '1386/05/15'
                });
                setShowAddForm(true);
              }}
              className="bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <UserPlus size={15} />
              <span>افزودن عضو جدید به جوخه</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Add / Edit Form Modal Box */}
        {showAddForm && (
          <form onSubmit={handleSubmitMember} className="bg-slate-950 border border-red-900/60 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-red-400 border-b border-slate-800 pb-2">
              {editingUserId ? 'ویرایش مشخصات رزمنده' : 'ثبت رزمنده جدید در جوخه (حداکثر ۶ نفر)'}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">نام:</label>
                <input
                  type="text"
                  value={memberForm.first_name}
                  onChange={(e) => setMemberForm({ ...memberForm, first_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">نام خانوادگی:</label>
                <input
                  type="text"
                  value={memberForm.last_name}
                  onChange={(e) => setMemberForm({ ...memberForm, last_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">کد ملی ۱۰ رقمی:</label>
                <input
                  type="text"
                  maxLength={10}
                  value={memberForm.national_code}
                  onChange={(e) => setMemberForm({ ...memberForm, national_code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">شماره موبایل:</label>
                <input
                  type="text"
                  maxLength={11}
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">پایه تحصیلی:</label>
                <input
                  type="text"
                  value={memberForm.grade}
                  onChange={(e) => setMemberForm({ ...memberForm, grade: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">تاریخ تولد شمسی:</label>
                <PersianDatePicker
                  value={memberForm.birth_date}
                  onChange={(val) => setMemberForm({ ...memberForm, birth_date: val })}
                  isGirls={currentUser.gender === 'دختر'}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">رمز عبور:</label>
                <input
                  type="password"
                  value={memberForm.password}
                  onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required={!editingUserId}
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">درجه جوخه:</label>
                <select
                  value={memberForm.squad_rank}
                  onChange={(e) => setMemberForm({ ...memberForm, squad_rank: e.target.value as SquadRank })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="soldier">سرباز</option>
                  <option value="farmando">فرمانرو</option>
                  <option value="jokhedar">جوخه‌دار</option>
                  <option value="commander">فرمانده</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-1/3 bg-slate-800 text-slate-300 text-xs font-bold py-2 rounded-lg"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="w-2/3 bg-red-700 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition"
              >
                {editingUserId ? 'ثبت تغییرات' : 'افزودن به اعضا'}
              </button>
            </div>
          </form>
        )}

        {/* Squad Members List Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400">اعضای ثبت‌شده در جوخه:</h4>

          <div className="space-y-2">
            {squadMembers.map(m => (
              <div 
                key={m.id}
                className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    m.role === 'leader' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-900 text-slate-300'
                  }`}>
                    {m.first_name[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-white">{m.first_name} {m.last_name}</span>
                      <span className="text-[10px] bg-slate-900 text-slate-400 font-mono px-1.5 rounded">
                        کد: {m.personal_code}
                      </span>
                      {m.role === 'leader' && (
                        <span className="bg-red-950 text-red-300 text-[9px] font-bold px-1.5 rounded border border-red-800/60">
                          فرمانده
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>کد ملی: <span className="font-mono">{m.national_code}</span></span>
                      <span>موبایل: <span className="font-mono">{m.phone}</span></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {m.role !== 'leader' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700"
                      title="ویرایش عضو"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(m)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800"
                      title="حذف از جوخه"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
