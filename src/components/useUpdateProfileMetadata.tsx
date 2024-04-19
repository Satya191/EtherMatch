import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { MetadataAttributeType, profile } from '@lens-protocol/metadata';
import { Profile, useSetProfileMetadata } from '@lens-protocol/react-web';
import { SessionType, useSession as useLensSession, AppId } from "@lens-protocol/react-web";

import { useIrysUploadHandler } from '@/utils/useIrysUploader';

interface FormInputs {
  name: string;
  bio: string;
  skills: { id: string; name: string }[];
  wantToLearns: { id: string; name: string }[];
  sponsored: boolean;
}

type UpdateProfileFormProps = {
  activeProfile: Profile;
};

function UpdateProfileForm({ activeProfile }: UpdateProfileFormProps) {
  const { execute: update, error, loading } = useSetProfileMetadata();
  const uploadMetadata = useIrysUploadHandler();
  const { control, register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      name: activeProfile.metadata?.displayName ?? '',
      bio: activeProfile.metadata?.bio ?? '',
      skills: [],
      wantToLearns: [],
      sponsored: true
    }
  });

  const { fields: skillsFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const { fields: wantToLearnsFields, append: appendWantToLearn, remove: removeWantToLearn } = useFieldArray({
    control,
    name: 'wantToLearns'
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const metadata = profile({
      appId: 'SkillXChange' as AppId,
      name: data.name,
      bio: data.bio,
      attributes: [
        {
          key: 'skills',
          value: JSON.stringify(data.skills.map(skill => skill.name)),
          type: MetadataAttributeType.JSON,
        },
        {
          key: 'wantToLearns',
          value: JSON.stringify(data.wantToLearns.map(wantToLearn => wantToLearn.name)),
          type: MetadataAttributeType.JSON,
        },
      ],
    });

    const metadataURI = await uploadMetadata(metadata);

    const result = await update({
      metadataURI,
      sponsored: data.sponsored,
    });

    if (result.isFailure()) {
      console.log(result.error.message);
      return;
    }

    const completion = await result.value.waitForCompletion();

    if (completion.isFailure()) {
      console.log(completion.error.message);
      return;
    }

    console.log('Profile updated');
    console.log('this function profile metadata appId (also current session profile, useSession function called before change profile metadata): ', activeProfile.metadata?.bio);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ margin: '20px' }}>
        <label>
          Name:
          <input
            type="text"
            placeholder="Your name"
            required
            disabled={loading}
            {...register('name')}
          />
        </label>
      </div>

      <div style={{ margin: '20px' }}>
        <label>
          Bio:
          <textarea
            rows={3}
            placeholder="Write a line about you"
            required
            style={{ resize: 'none' }}
            disabled={loading}
            {...register('bio')}
          ></textarea>
        </label>
      </div>

      <div style={{ margin: '20px' }}>
        <label>
          Skills:
          <input
            type="text"
            placeholder="Add a skill and press Enter"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (e.currentTarget.value.trim() !== '') {
                  appendSkill({ id: Date.now().toString(), name: e.currentTarget.value.trim() });
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          {skillsFields.map((item, index) => (
            <div key={item.id} style={{ marginTop: '5px' }}>
              {item.name}
              <button type="button" onClick={() => removeSkill(index)} style={{ marginLeft: '10px' }}>Remove</button>
            </div>
          ))}
        </label>
      </div>

      <div style={{ margin: '20px' }}>
        <label>
          Want to Learns:
          <input
            type="text"
            placeholder="Add what you want to learn and press Enter"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (e.currentTarget.value.trim() !== '') {
                  appendWantToLearn({ id: Date.now().toString(), name: e.currentTarget.value.trim() });
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          {wantToLearnsFields.map((item, index) => (
            <div key={item.id} style={{ marginTop: '5px' }}>
              {item.name}
              <button type="button" onClick={() => removeWantToLearn(index)} style={{ marginLeft: '10px' }}>Remove</button>
            </div>
          ))}
        </label>
      </div>

      <div style={{ margin: '20px' }}>
        <label>
          <input
            type="checkbox"
            {...register('sponsored')}
          />
          Sponsored
        </label>
      </div>

      <div style={{ margin: '20px' }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>

      {error && <p>{error.message}</p>}
    </form>
  );
}

export function UseSetProfileMetadata() {
  //pass in session instead of calling uselenssession again.
  const { data: session } = useLensSession();
  if (!session || !session.authenticated || !(session.type === SessionType.WithProfile)) return null;

  return (
    <div>
      <h1>Create your profile!</h1>
      <div>
        <UpdateProfileForm activeProfile={session.profile} />
      </div>
    </div>
  );
}
