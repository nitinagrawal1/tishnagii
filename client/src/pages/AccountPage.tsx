import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { sendPasswordResetEmail, updateEmail, updateProfile } from '@firebase/auth';
import { ArrowRight, Check, CircleHelp, MapPin, PackageCheck, Plus, RefreshCw, Trash2, UserRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { auth } from '../firebase';
import { OrderInvoice } from '../components/common/OrderInvoice';
import { handleInternalLinkClick } from '../utils/navigation';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import {
  deleteCustomerAddress,
  getCustomerAddresses,
  getCustomerOrders,
  getCustomerProfile,
  getAccountDataErrorMessage,
  saveCustomerAddress,
  saveCustomerProfile,
  setDefaultCustomerAddress,
  type AddressLabel,
  type CustomerAddress,
  type CustomerOrder,
  type CustomerProfile,
} from '../services/account';

type AccountSection = 'profile' | 'addresses' | 'orders' | 'settings' | 'support';

const initialProfile: CustomerProfile = {
  fullName: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  photoURL: '',
  emailUpdates: true,
  smsUpdates: false,
};

const initialAddress: Omit<CustomerAddress, 'id'> = {
  fullName: '',
  phone: '',
  house: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
  label: 'Home',
  isDefault: false,
};

const sections: { id: AccountSection; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Address Book' },
  { id: 'orders', label: 'My Orders' },
  { id: 'settings', label: 'Settings' },
  { id: 'support', label: 'Help & Support' },
];

const formatOrderDate = (value: CustomerOrder['createdAt']) => {
  if (!value) return 'Date unavailable';
  const date = typeof value === 'string'
    ? new Date(value)
    : value instanceof Date
      ? value
      : 'toDate' in value && typeof value.toDate === 'function'
        ? value.toDate()
        : null;
  if (!date || Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const formatPaymentMethod = (method: string, details?: string) => {
  const labels: Record<string, string> = {
    upi: 'UPI',
    card: details ? `Card (${details})` : 'Card',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    cod: 'Cash on Delivery',
  };
  return labels[method?.toLowerCase()] || method || 'Not available';
};

export const AccountPage: React.FC = () => {
  const { user, authLoading, setIsAuthModalOpen, navigateTo, showToast } = useShop();
  const [section, setSection] = useState<AccountSection>(() => {
    if (typeof window === 'undefined') return 'profile';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as AccountSection;
    return sections.some(s => s.id === tab) ? tab : 'profile';
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('order');
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', section);
    if (selectedOrderId) url.searchParams.set('order', selectedOrderId);
    else url.searchParams.delete('order');
    window.history.replaceState(window.history.state, '', url);
  }, [section, selectedOrderId]);
  React.useEffect(() => {
    const restoreAccountState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as AccountSection;
      setSection(sections.some((item) => item.id === tab) ? tab : 'profile');
      setSelectedOrderId(params.get('order'));
    };
    window.addEventListener('popstate', restoreAccountState);
    return () => window.removeEventListener('popstate', restoreAccountState);
  }, []);
  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);
  const [email, setEmail] = useState('');
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [ordersLoadedForUid, setOrdersLoadedForUid] = useState('');
  const ordersContainerRef = useRef<HTMLDivElement>(null);
  const ordersVirtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => ordersContainerRef.current,
    estimateSize: () => 300,
    measureElement: (element) => element.getBoundingClientRect().height + 16,
    overscan: 5,
    enabled: orders.length > 50,
  });
  const [addressForm, setAddressForm] = useState<Omit<CustomerAddress, 'id'>>(initialAddress);
  const savedProfileRef = useRef<CustomerProfile>(initialProfile);
  const savedEmailRef = useRef('');
  const addressBaselineRef = useRef<Omit<CustomerAddress, 'id'>>(initialAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [pageError, setPageError] = useState('');
  const hasProfileDraft = JSON.stringify(profile) !== JSON.stringify(savedProfileRef.current)
    || email.trim() !== savedEmailRef.current;
  const hasAddressDraft = showAddressForm
    && JSON.stringify(addressForm) !== JSON.stringify(addressBaselineRef.current);
  const { confirmDiscard, markClean } = useUnsavedChanges(
    hasProfileDraft || hasAddressDraft,
    'account-draft',
  );

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let isCurrent = true;
    const loadAccount = async () => {
      setIsLoading(true);
      setPageError('');
      setEmail(user.email || '');

      const [profileResult, addressesResult] = await Promise.allSettled([
        getCustomerProfile(user.uid, {
          ...initialProfile,
          fullName: user.displayName || '',
          photoURL: user.photoURL || '',
        }),
        getCustomerAddresses(user.uid),
      ]);

      if (!isCurrent) return;

      const accountErrors: string[] = [];
      if (profileResult.status === 'fulfilled') {
        const savedProfile = profileResult.value;
        const nextProfile = {
          ...initialProfile,
          ...savedProfile,
          fullName: savedProfile.fullName || user.displayName || '',
          photoURL: savedProfile.photoURL || user.photoURL || '',
        };
        setProfile(nextProfile);
        savedProfileRef.current = nextProfile;
      } else {
        accountErrors.push(getAccountDataErrorMessage(profileResult.reason, 'load your profile'));
      }

      if (addressesResult.status === 'fulfilled') setAddresses(addressesResult.value);
      else accountErrors.push(getAccountDataErrorMessage(addressesResult.reason, 'load saved addresses'));
      savedEmailRef.current = user.email || '';
      setPageError(accountErrors.join('\n'));

      setIsLoading(false);
    };

    void loadAccount();
    return () => { isCurrent = false; };
  }, [user]);

  useEffect(() => {
    if (!user || section !== 'orders' || ordersLoadedForUid === user.uid) return;
    let isCurrent = true;
    setOrdersLoading(true);
    setOrdersError('');
    void getCustomerOrders(user.uid)
      .then((savedOrders) => { if (isCurrent) setOrders(savedOrders); })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        setOrders([]);
        setOrdersError(getAccountDataErrorMessage(error, 'load order history'));
      })
      .finally(() => {
        if (!isCurrent) return;
        setOrdersLoadedForUid(user.uid);
        setOrdersLoading(false);
      });
    return () => { isCurrent = false; };
  }, [ordersLoadedForUid, section, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    setPageError('');

    try {
      const nextEmail = email.trim();
      if (!nextEmail) throw new Error('Please enter a valid email address.');
      if (nextEmail !== user.email) await updateEmail(user, nextEmail);
      const nextProfile = { ...profile, fullName: profile.fullName.trim(), phone: profile.phone.trim() };
      await updateProfile(user, { displayName: nextProfile.fullName, photoURL: nextProfile.photoURL || null });
      await saveCustomerProfile(user.uid, nextProfile);
      setProfile(nextProfile);
      savedProfileRef.current = nextProfile;
      savedEmailRef.current = nextEmail;
      markClean();
      showToast('Your profile has been updated.');
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Unable to save your profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setPageError('Add an email address to your profile before requesting a password reset.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      showToast(`Password reset instructions sent to ${user.email}.`, 'info');
    } catch {
      setPageError('Unable to send password reset instructions. Please try again.');
    }
  };

  const resetAddressForm = () => {
    setAddressForm(initialAddress);
    addressBaselineRef.current = initialAddress;
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleSectionChange = (nextSection: AccountSection) => {
    if (nextSection === section) return;
    if ((hasProfileDraft || hasAddressDraft) && !confirmDiscard()) return;
    if (hasProfileDraft) {
      setProfile(savedProfileRef.current);
      setEmail(savedEmailRef.current);
    }
    if (hasAddressDraft) resetAddressForm();
    markClean();
    setSection(nextSection);
  };

  const handleSaveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setIsSavingAddress(true);
    setPageError('');
    try {
      await saveCustomerAddress(user.uid, {
        ...addressForm,
        fullName: addressForm.fullName.trim(),
        phone: addressForm.phone.trim(),
        isDefault: addressForm.isDefault || addresses.length === 0,
      }, editingAddressId || undefined);
      setAddresses(await getCustomerAddresses(user.uid));
      markClean();
      resetAddressForm();
      showToast(editingAddressId ? 'Address updated.' : 'Address saved.');
    } catch (error) {
      setPageError(getAccountDataErrorMessage(error, 'save this address'));
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleEditAddress = (address: CustomerAddress) => {
    const { id: _id, ...fields } = address;
    setAddressForm(fields);
    addressBaselineRef.current = fields;
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    try {
      await setDefaultCustomerAddress(user.uid, addressId);
      setAddresses(await getCustomerAddresses(user.uid));
      showToast('Default delivery address updated.');
    } catch (error) {
      setPageError(getAccountDataErrorMessage(error, 'update the default address'));
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    if (!user) return;
    try {
      const addressToDelete = addresses.find((address) => address.id === addressId);
      if (!window.confirm(`Delete the ${addressToDelete?.label || 'saved'} address for ${addressToDelete?.fullName || 'this customer'}?`)) return;
      await deleteCustomerAddress(user.uid, addressId);
      setAddresses(await getCustomerAddresses(user.uid));
      showToast('Address removed.', 'info');
    } catch (error) {
      setPageError(getAccountDataErrorMessage(error, 'remove this address'));
    }
  };

  if (authLoading || isLoading) {
    return     <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-[#4A1525]/70" role="status">Loading your account…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg border border-[#EADBCE] bg-[#F4EFEA] p-8 text-center">
          <UserRound className="mx-auto mb-4 h-10 w-10 text-[#C49A45]" />
          <h1 className="font-serif text-3xl text-[#2A0814]">Your TISHNAGII Account</h1>
          <p className="mt-2 text-sm text-[#4A1525]/70">Sign in to manage your profile, addresses, and orders.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="mt-6 bg-[#2A0814] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#380E1C]"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-[#EADBCE] pb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#C49A45]">Your Account</span>
        <h1 className="mt-1 font-serif text-3xl font-medium text-[#2A0814] sm:text-4xl">
          Welcome{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-[#4A1525]/70">Manage your details and keep your TISHNAGII orders close.</p>
      </header>

      <nav aria-label="Account sections" className="flex gap-2 overflow-x-auto border-b border-[#EADBCE] pb-3">
        {sections.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            aria-current={section === item.id ? 'page' : undefined}
            aria-pressed={section === item.id}
            className={`shrink-0 px-4 py-2 text-sm transition-colors ${section === item.id ? 'bg-[#2A0814] text-[#FAF7F2]' : 'text-[#4A1525] hover:bg-[#F4EFEA]'}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {pageError && <p role="alert" className="whitespace-pre-line border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{pageError}</p>}

      {section === 'profile' && (
        <form onSubmit={(event) => { event.preventDefault(); void handleSaveProfile(); }} className="max-w-3xl space-y-6">
          <div className="flex items-center gap-4 border-b border-[#EADBCE] pb-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C49A45]/40 bg-[#F4EFEA] text-[#C49A45]">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile" width={80} height={80} className="h-full w-full object-cover" />
              ) : <UserRound className="h-8 w-8" />}
            </div>
            <div>
              <label className="block text-sm text-[#2A0814]">
                Profile photo URL or public image path
                <input
                  type="text"
                  name="photoURL"
                  autoComplete="url"
                  spellCheck={false}
                  value={profile.photoURL}
                  onChange={(event) => setProfile({ ...profile, photoURL: event.target.value })}
                  placeholder="e.g. /images/profile.jpg…"
                  className="mt-1 block w-full border border-[#EADBCE] bg-white/60 px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]"
                />
              </label>
              <p className="mt-1 text-xs text-[#4A1525]/60">Use an image already hosted publicly; no file upload is required.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-[#2A0814]">
              <span>Full Name</span>
              <input required name="name" autoComplete="name" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} className="w-full border border-[#EADBCE] bg-white/60 px-3 py-2.5 text-[#2A0814] outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]" />
            </label>
            <label className="space-y-1 text-sm text-[#2A0814]">
              <span>Email</span>
              <input required name="email" type="email" autoComplete="email" spellCheck={false} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-[#EADBCE] bg-white/60 px-3 py-2.5 text-[#2A0814] outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]" />
            </label>
            <label className="space-y-1 text-sm text-[#2A0814]">
              <span>Mobile Number</span>
              <input name="tel" type="tel" autoComplete="tel" inputMode="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className="w-full border border-[#EADBCE] bg-white/60 px-3 py-2.5 text-[#2A0814] outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]" />
            </label>
            <label className="space-y-1 text-sm text-[#2A0814]">
              <span>Gender</span>
              <select name="gender" value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })} className="w-full border border-[#EADBCE] bg-white/60 px-3 py-2.5 text-[#2A0814] outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]">
                <option value="">Select</option>
                <option value="woman">Woman</option>
                <option value="man">Man</option>
                <option value="nonbinary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-[#2A0814]">
              <span>Date of Birth</span>
              <input name="bday" autoComplete="bday" type="date" value={profile.dateOfBirth} onChange={(event) => setProfile({ ...profile, dateOfBirth: event.target.value })} className="w-full border border-[#EADBCE] bg-white/60 px-3 py-2.5 text-[#2A0814] outline-none focus-visible:ring-1 focus-visible:ring-[#C49A45] focus:border-[#C49A45]" />
            </label>
          </div>
          <button disabled={isSavingProfile} className="bg-[#2A0814] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#380E1C] disabled:opacity-60 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
            {isSavingProfile && <span aria-hidden="true" className="mr-2 inline-flex animate-spin"><RefreshCw className="h-4 w-4" /></span>}
            {isSavingProfile ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      )}

      {section === 'addresses' && (
        <section className="max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADBCE] pb-4">
            <div>
              <h2 className="font-serif text-2xl text-[#2A0814]">Address Book</h2>
              <p className="mt-1 text-sm text-[#4A1525]/70">Choose a saved address at checkout or keep several on hand.</p>
            </div>
            {!showAddressForm && (
              <button type="button" onClick={() => { setAddressForm(initialAddress); addressBaselineRef.current = initialAddress; setEditingAddressId(null); setShowAddressForm(true); }} className="inline-flex min-h-11 items-center gap-2 border border-[#2A0814] px-4 py-2.5 text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]">
                <Plus className="h-4 w-4" /> Add Address
              </button>
            )}
          </div>

          {showAddressForm && (
            <form onSubmit={handleSaveAddress} className="grid gap-4 border border-[#EADBCE] bg-[#F4EFEA] p-5 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-[#2A0814]">Full Name<input required name="name" autoComplete="name" value={addressForm.fullName} onChange={(event) => setAddressForm({ ...addressForm, fullName: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">Phone<input required name="tel" autoComplete="tel" type="tel" inputMode="tel" value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">House / Flat / Building<input required name="address-line1" autoComplete="address-line1" value={addressForm.house} onChange={(event) => setAddressForm({ ...addressForm, house: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">Street / Area<input required name="address-line2" autoComplete="address-line2" value={addressForm.street} onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">City<input required name="address-level2" autoComplete="address-level2" value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">State<input required name="address-level1" autoComplete="address-level1" value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">PIN Code<input required name="postal-code" autoComplete="postal-code" inputMode="numeric" value={addressForm.pinCode} onChange={(event) => setAddressForm({ ...addressForm, pinCode: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">Country<input required name="country-name" autoComplete="country-name" value={addressForm.country} onChange={(event) => setAddressForm({ ...addressForm, country: event.target.value })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]" /></label>
              <label className="space-y-1 text-sm text-[#2A0814]">Save As<select name="addressLabel" value={addressForm.label} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value as AddressLabel })} className="w-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-2.5 text-[#2A0814]"><option>Home</option><option>Work</option><option>Other</option></select></label>
              <label className="flex min-h-11 items-center gap-2 self-end pb-2 text-sm text-[#2A0814]"><input name="isDefault" type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} /> Set as default address</label>
              <div className="flex gap-2 sm:col-span-2">
                <button disabled={isSavingAddress} className="bg-[#2A0814] px-5 py-2.5 text-sm text-[#FAF7F2] disabled:opacity-60 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">{isSavingAddress && <span aria-hidden="true" className="mr-2 inline-flex animate-spin"><RefreshCw className="h-4 w-4" /></span>}{isSavingAddress ? 'Saving…' : editingAddressId ? 'Update Address' : 'Save Address'}</button>
                <button type="button" onClick={resetAddressForm} className="border border-[#EADBCE] px-5 py-2.5 text-sm text-[#2A0814] touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">Cancel</button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !showAddressForm ? (
            <div className="border border-[#EADBCE] bg-[#F4EFEA] px-5 py-10 text-center text-sm text-[#4A1525]/70">No saved addresses yet. Add one above to speed up checkout.</div>
          ) : (
            <div className="divide-y divide-[#EADBCE] border-y border-[#EADBCE]">
              {addresses.map((address) => (
                <article key={address.id} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center touch-manipulation">
                  <div className="flex gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C49A45]" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-[#2A0814]">{address.fullName}</h3>
                        <span className="border border-[#EADBCE] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#4A1525]">{address.label}</span>
                        {address.isDefault && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-800"><Check className="h-3 w-3" /> Default</span>}
                      </div>
                      <p className="mt-1 text-sm text-[#4A1525]/75">{address.house}, {address.street}, {address.city}, {address.state} {address.pinCode}, {address.country}</p>
                      <p className="text-xs text-[#4A1525]/65">{address.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pl-8 text-xs">
                    {!address.isDefault && <button type="button" onClick={() => void handleSetDefault(address.id)} className="min-h-11 text-[#4A1525] underline">Set Default</button>}
                    <button type="button" onClick={() => handleEditAddress(address)} className="min-h-11 text-[#4A1525] underline">Edit</button>
                    <button type="button" onClick={() => void handleDeleteAddress(address.id)} className="inline-flex min-h-11 items-center gap-1 text-red-700 underline"><Trash2 className="h-3 w-3" /> Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {section === 'orders' && (
        <section className="max-w-4xl space-y-5">
          <div className="border-b border-[#EADBCE] pb-4">
            <h2 className="font-serif text-2xl text-[#2A0814]">My Orders</h2>
            <p className="mt-1 text-sm text-[#4A1525]/70">Your verified online payments and saved orders.</p>
          </div>
          {selectedOrderId && orders.some((order) => order.id === selectedOrderId || order.orderId === selectedOrderId) ? (
            <OrderInvoice
              order={orders.find((order) => order.id === selectedOrderId || order.orderId === selectedOrderId)!}
              onBack={() => setSelectedOrderId(null)}
            />
          ) : ordersLoading ? (
            <div className="border border-[#EADBCE] bg-[#F4EFEA] px-5 py-10 text-center text-sm text-[#4A1525]/70" role="status">Loading your orders…</div>
          ) : ordersError ? (
            <div className="border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-800" role="alert">
              <p>{ordersError}</p>
              <button type="button" onClick={() => { setOrdersLoadedForUid(''); setOrdersError(''); }} className="mt-3 min-h-11 text-xs font-semibold underline">Retry</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-[#EADBCE] bg-[#F4EFEA] px-5 py-12 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-[#C49A45]" />
              <p className="mt-3 text-sm text-[#4A1525]/70">No order history yet.</p>
              <a href="/shop" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('shop'))} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#2A0814] underline">Explore the collection <ArrowRight className="h-4 w-4" /></a>
            </div>
          ) : (
            <div
              ref={ordersContainerRef}
              className={orders.length > 50 ? 'max-h-[70vh] overflow-y-auto overscroll-contain' : 'space-y-4'}
            >
              <div
                className={orders.length > 50 ? '' : 'space-y-4'}
                style={orders.length > 50 ? { height: ordersVirtualizer.getTotalSize(), position: 'relative' } : undefined}
              >
              {(orders.length > 50
                ? ordersVirtualizer.getVirtualItems()
                : orders.map((_, index) => ({ index, start: 0 }))
              ).map(({ index, start }) => {
                const order = orders[index];
                return (
                <article
                  key={order.id}
                  ref={orders.length > 50 ? ordersVirtualizer.measureElement : undefined}
                  data-index={index}
                  style={orders.length > 50 ? { position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${start}px)` } : undefined}
                  className={`border border-[#EADBCE] bg-[#FAF7F2] touch-manipulation${orders.length > 50 ? ' mb-4' : ''}`}
                >
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADBCE] bg-[#F4EFEA] px-4 py-3 text-xs">
                    <span className="font-medium text-[#2A0814]">Order {order.orderId || order.id}</span>
                    <span className="text-[#4A1525]/70">{formatOrderDate(order.createdAt)}</span>
                    <span className="uppercase tracking-wider text-[#4A1525]">{order.status || 'Processing'}</span>
                  </header>
                  <div className="space-y-3 p-4">
                    {order.items?.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.name} width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 border border-[#EADBCE] object-cover" />}
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-medium text-[#2A0814]">{item.name}</p>
                          <p className="text-xs text-[#4A1525]/65">Qty {item.quantity} · <span className="tabular-nums">₹{item.price.toLocaleString('en-IN')}</span> each</p>
                        </div>
                        <span className="text-sm font-medium text-[#2A0814]"><span className="tabular-nums">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span></span>
                      </div>
                    ))}
                    <div className="flex flex-wrap justify-between gap-2 border-t border-[#EADBCE] pt-3 text-xs">
                      <span className="text-[#4A1525]/70">Payment: {formatPaymentMethod(order.paymentMethod, order.paymentMethodDetails)} · {order.paymentStatus}</span>
                      <span className="font-semibold text-[#2A0814]">Total <span className="tabular-nums">₹{order.amount.toLocaleString('en-IN')}</span> {order.currency || 'INR'}</span>
                    </div>
                    {order.customer?.address && <p className="text-xs text-[#4A1525]/70">Delivering to: {order.customer.address}</p>}
                    <button type="button" onClick={() => setSelectedOrderId(order.orderId || order.id)} aria-label={`View order details and invoice for ${order.orderId || order.id}`} className="no-print min-h-11 pt-1 text-xs font-medium text-[#2A0814] underline underline-offset-4">Order Details & Invoice</button>
                  </div>
                </article>
                );
              })}
              </div>
            </div>
          )}
        </section>
      )}

      {section === 'settings' && (
        <section className="max-w-3xl space-y-6">
          <div className="border-b border-[#EADBCE] pb-4">
            <h2 className="font-serif text-2xl text-[#2A0814]">Account Settings</h2>
            <p className="mt-1 text-sm text-[#4A1525]/70">Choose how TISHNAGII shares account and collection updates.</p>
          </div>
          <label className="flex items-start justify-between gap-4 border-b border-[#EADBCE] py-4 text-sm">
            <span><strong className="block font-medium text-[#2A0814]">Email updates</strong><span className="mt-1 block text-xs text-[#4A1525]/70">Order updates and occasional collection news.</span></span>
            <input name="emailUpdates" type="checkbox" checked={profile.emailUpdates} onChange={(event) => setProfile({ ...profile, emailUpdates: event.target.checked })} />
          </label>
          <label className="flex items-start justify-between gap-4 border-b border-[#EADBCE] py-4 text-sm">
            <span><strong className="block font-medium text-[#2A0814]">SMS updates</strong><span className="mt-1 block text-xs text-[#4A1525]/70">Delivery and account notifications to your saved mobile.</span></span>
            <input name="smsUpdates" type="checkbox" checked={profile.smsUpdates} onChange={(event) => setProfile({ ...profile, smsUpdates: event.target.checked })} />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADBCE] py-4">
            <div>
              <strong className="block text-sm font-medium text-[#2A0814]">Password & Security</strong>
              <span className="mt-1 block text-xs text-[#4A1525]/70">Request a password reset link for your account email.</span>
            </div>
            <button type="button" onClick={() => void handlePasswordReset()} className="min-h-11 border border-[#EADBCE] px-4 py-2 text-sm text-[#2A0814] transition-colors hover:bg-[#F4EFEA]">Send Reset Link</button>
          </div>
          <button type="button" onClick={() => void handleSaveProfile()} disabled={isSavingProfile} className="min-h-11 bg-[#2A0814] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#380E1C] disabled:opacity-60">
            {isSavingProfile && <span aria-hidden="true" className="mr-2 inline-flex animate-spin"><RefreshCw className="h-4 w-4" /></span>}
            {isSavingProfile ? 'Saving…' : 'Save Settings'}
          </button>
        </section>
      )}

      {section === 'support' && (
        <section className="max-w-3xl space-y-6">
          <div className="border-b border-[#EADBCE] pb-4">
            <h2 className="font-serif text-2xl text-[#2A0814]">Help & Support</h2>
            <p className="mt-1 text-sm text-[#4A1525]/70">Our Jaipur concierge is ready to help with your account or order.</p>
          </div>
          <div className="flex items-start gap-4 border-b border-[#EADBCE] py-5">
            <CircleHelp className="mt-1 h-5 w-5 text-[#C49A45]" />
            <div className="space-y-2 text-sm text-[#4A1525]">
              <p>For order assistance, delivery questions, or styling support:</p>
              <a className="block text-[#2A0814] underline touch-manipulation" href="mailto:care@tishnagii.com">care@tishnagii.com</a>
              <a className="block text-[#2A0814] underline touch-manipulation" href="tel:+919820012345">+91 98200 12345</a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/contact" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('contact'))} className="inline-flex min-h-11 items-center bg-[#2A0814] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2]">Contact Concierge</a>
            <a href="/faq" onClick={(event) => handleInternalLinkClick(event, () => navigateTo('faq'))} className="inline-flex min-h-11 items-center border border-[#EADBCE] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#2A0814]">Browse FAQs</a>
          </div>
        </section>
      )}
    </div>
  );
};
