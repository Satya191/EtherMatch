"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useUpdateProfileMetadata } from './useUpdateProfileMetadata'

interface IFormInput {
  name: string;
  bio: string;
  skills: Array<{ id: string; name: string }>;
  wantToLearns: Array<{ id: string; name: string }>;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  skills: z.array(z.object({ name: z.string() })).min(1, { message: "Please add at least one skill." }),
  wantToLearns: z.array(z.object({ name: z.string() })).min(1, { message: "Please add at least one item you want to learn." }),
});

export function UserProfileForm() {
  const { updateMetadata, loading, error } = useUpdateProfileMetadata();

  const form = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      skills: [],
      wantToLearns: [],
    },
  });

  const { fields: skillsFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: 'skills'
  });

  const { fields: wantToLearnsFields, append: appendWantToLearn, remove: removeWantToLearn } = useFieldArray({
    control: form.control,
    name: 'wantToLearns'
  });

  const [skillInput, setSkillInput] = useState('');
  const [wantToLearnInput, setWantToLearnInput] = useState('');

  const handleSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      if (skillInput.trim()) {
        appendSkill({ id: Date.now().toString(), name: skillInput.trim() });
        setSkillInput('');
      }
    }
  };

  const handleWantToLearnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      if (wantToLearnInput.trim()) {
        appendWantToLearn({ id: Date.now().toString(), name: wantToLearnInput.trim() });
        setWantToLearnInput('');
      }
    }
  };

  const handleSubmit = async (data: IFormInput) => {
    console.log('Name:', data.name);
    console.log('Bio:', data.bio);
    console.log('Skills and WantToLearns:', JSON.stringify({ skills: data.skills, wantToLearns: data.wantToLearns }));
    // Properly structure the data to match MetadataParams
    const metadataParams = {
      name: data.name,        // Directly use 'name' as expected by MetadataParams
      bio: data.bio,          // Directly use 'bio'
      jsonContent: JSON.stringify({ 
          skills: data.skills,
          wantToLearns: data.wantToLearns
      })
    };
    await updateMetadata(metadataParams);
    
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-2/3 space-y-6">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...form.register('name')} placeholder="Enter your name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
        <FormField name="bio" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <textarea {...form.register('bio')} className="input" placeholder="Tell us a little about yourself" rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
        <div>
          <FormLabel>Skills</FormLabel>
          <Input placeholder="Add a skill and press Enter/Tab" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} />
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsFields.map((item, index) => (
              <button key={item.id} onClick={() => removeSkill(index)} className="bg-blue-200 rounded px-2 py-1">{item.name}</button>
            ))}
          </div>
        </div>
        <div>
          <FormLabel>Want to Learns</FormLabel>
          <Input placeholder="Add what you want to learn and press Enter/Tab" value={wantToLearnInput} onChange={e => setWantToLearnInput(e.target.value)} onKeyDown={handleWantToLearnKeyDown} />
          <div className="flex flex-wrap gap-2 mt-2">
            {wantToLearnsFields.map((item, index) => (
              <button key={item.id} onClick={() => removeWantToLearn(index)} className="bg-green-200 rounded px-2 py-1">{item.name}</button>
            ))}
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default UserProfileForm;
