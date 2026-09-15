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
import { User, Group } from '../types';
import { validateNationalCode, validatePhoneNumber, validateJalaliDate, generatePersonalCode } from '../utils/jalali';
import { apiCheckNationalCodeExists } from '../lib/backendApi';
import PersianDatePicker from './PersianDatePicker';

interface SquadManagementModalProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  onClose: () => void;
  triggerAlert: (msg: string) => void;
}

export default function SquadManagementModal({
  currentUser,
  users,
  setUsers,
  groups,
  setGroups,
  onClose,
  triggerAlert
}: SquadManagementModalProps) {
  // Find group
  const userGroup = groups.find(g => g.id === currentUser.group_id);
  const squadMembers = users.filter(u => u.group_id === currentUser.group_id);

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
    birth_date: '1386/05/15'
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setUsers(prev => prev.map(u => 
        u.id === editingUserId ? { ...u, ...memberForm } : u
      ));
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
        password: currentUser.password,
        role: 'member',
        education_level: currentUser.education_level,
        grade: memberForm.grade,
        gender: currentUser.gender,
        province: currentUser.province,
        city: currentUser.city,
        birth_date: memberForm.birth_date,
        school_name: currentUser.school_name,
        personal_code: generatePersonalCode(),
        group_id: currentUser.group_id
      };

      setUsers(prev => [...prev, newMember]);
      
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
      birth_date: '1386/05/15'
    });
    setShowAddForm(false);
  };

  // Remove member handler
  const handleRemoveMember = (member: User) => {
    if (member.role === 'leader') {
      triggerAlert('امکان حذف فرمانده جوخه وجود ندارد.');
      return;
    }

    if (confirm(`آیا از حذف رزمنده "${member.first_name} ${member.last_name}" از جوخه اطمینان دارید؟`)) {
      setUsers(prev => prev.filter(u => u.id !== member.id));
      if (userGroup) {
        setGroups(prev => prev.map(g => 
          g.id === userGroup.id ? { ...g, members_count: Math.max(1, g.members_count - 1) } : g
        ));
      }
      triggerAlert(`رزمنده "${member.first_name} ${member.last_name}" از جوخه حذف شد.`);
    }
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
      birth_date: member.birth_date
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
          <span className="text-slate-300">
            تعداد اعضای فعلی: <span className="text-red-400 font-mono text-sm">{squadMembers.length}</span> از حداکثر ۶ نفر
          </span>
          {squadMembers.length < 6 && (
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
