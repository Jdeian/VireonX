import React from 'react';
import { ChartNoAxesGantt, Mail, Calendar, Camera, Briefcase, Loader2 } from 'lucide-react';
import { auth } from '@common/services/config';
import { Input } from '@common/components/shadcn/input';
import { Label } from '@common/components/shadcn/label';
import { Textarea } from '@common/components/shadcn/textarea';

const ROLE_SUGGESTIONS = [
  'Content Creator', 'Freelancer', 'Student', 'Coach', 'Influencer',
  'Photographer', 'Video Editor', 'Artist', 'Business', 'Restaurant / Cafe',
  'Clothing Brand', 'School Organization', 'Nonprofit Organization',
  'Real Estate', 'Agency', 'Online Store',
];

const ProfileCard = ({ profileData, formData, setFormData, isEditing, joinDate }) => {
  const initials = profileData?.fullName
    ?.split(' ').map((n) => n[0]).join('').slice(0, 2) || '?';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-24 bg-linear-to-r from-indigo-500 to-indigo-600 dark:from-indigo-800 dark:to-indigo-900" />
      <div className="-mt-12 px-6 pb-6">
        <div className="relative inline-block">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-md dark:border-slate-900 dark:bg-slate-800">
            <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-2xl font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              {initials}
            </div>
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
              <Camera size={14} className="text-slate-600 dark:text-slate-300" />
            </button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {/* Name */}
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {profileData?.fullName || 'Unknown User'}
            </h2>
          )}

          {/* Email — read only */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Mail size={14} />
            <span>{auth.currentUser?.email || '—'}</span>
          </div>

          {/* Bio */}
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Write a short bio..."
                className="resize-none"
              />
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm">
              <ChartNoAxesGantt size={14} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />
              <p className="flex-1 text-slate-600 dark:text-slate-300">
                {profileData?.bio || 'No bio yet.'}
              </p>
            </div>
          )}

          {/* Account role */}
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="accountRole">
                Role or business type{' '}
                <span className="text-slate-400 dark:text-slate-500">(optional)</span>
              </Label>
              <Input
                id="accountRole"
                list="role-suggestions"
                value={formData.accountRole}
                onChange={(e) => setFormData((prev) => ({ ...prev, accountRole: e.target.value }))}
                placeholder="Enter or select a role"
              />
              <datalist id="role-suggestions">
                {ROLE_SUGGESTIONS.map((role) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
            </div>
          ) : (
            profileData?.accountRole && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Briefcase size={14} />
                <span>{profileData.accountRole}</span>
              </div>
            )
          )}

          {/* Join date */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <Calendar size={13} />
            <span>Joined {joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;