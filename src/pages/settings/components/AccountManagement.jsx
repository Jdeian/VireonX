import React, { useState } from 'react';
import {
  Lock, Key, Loader2, Eye, EyeOff, AlertTriangle, Trash2,
} from 'lucide-react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@common/services/config';
import { Button } from '@common/components/shadcn/button';
import { Input } from '@common/components/shadcn/input';
import { Label } from '@common/components/shadcn/label';

const AccountManagement = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm]     = useState(false);
  const [currentPassword, setCurrentPassword]   = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [deletePassword, setDeletePassword]     = useState('');
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [showDelete, setShowDelete]             = useState(false);
  const [saving, setSaving]                     = useState(false);
  const [deleting, setDeleting]                 = useState(false);
  const [error, setError]                       = useState('');
  const [success, setSuccess]                   = useState('');

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect.');
      } else {
        setError('Failed to update password. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Please enter your password to confirm.');
      return;
    }

    try {
      setDeleting(true);
      setError('');
      const user = auth.currentUser;

      // Re-authenticate before deletion
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);

      // Delete Firestore data first
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete Firebase Auth account
      await deleteUser(user);

      // Auth state change will redirect to login automatically
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Account not deleted.');
      } else {
        setError('Failed to delete account. Please try again.');
      }
      setDeleting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Lock size={18} className="text-indigo-600" />
          Account Management
        </h2>
      </div>

      <div className="space-y-6 p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {success}
          </div>
        )}

        {/* Email — read only */}
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input value={auth.currentUser?.email || '—'} disabled className="opacity-60" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Email cannot be changed here. Contact support if needed.
          </p>
        </div>

        {/* Change password */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <Button
              variant="outline"
              onClick={() => { setShowPasswordForm((p) => !p); setError(''); }}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <Key size={13} />
              {showPasswordForm ? 'Cancel' : 'Change password'}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <Button
                type="button"
                onClick={handlePasswordChange}
                disabled={saving}
                className="w-full gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="space-y-3 rounded-xl border border-red-200 p-4 dark:border-red-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="font-semibold text-red-600 dark:text-red-400">Danger Zone</p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteForm ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowDeleteForm(true); setError(''); }}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Enter your password to confirm deletion:
              </p>
              <div className="relative">
                <Input
                  type={showDelete ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowDelete((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showDelete ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="gap-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowDeleteForm(false); setDeletePassword(''); setError(''); }}
                  className="border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;