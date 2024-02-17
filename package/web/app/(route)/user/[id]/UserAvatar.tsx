'use client';

import { FormEvent, useCallback, useState } from 'react';
import Image from 'next/image';
import { User } from '@prisma/client';

import { useDropzone } from 'react-dropzone';
import { Avatar } from '@nextui-org/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ImagePlus, Replace } from 'lucide-react';
import { deleteUserImage, uploadUserImage } from '@/lib/actions/user';

type UserAvatarProps = {
  user: User;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  const [file, setFile] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<string | null>(user.image);
  const [haveImage, setHaveImage] = useState(user.image !== null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file?.type.split('/')[0] !== 'image') {
      toast.error('File type should be an image');
      return;
    }

    setIsDirty(true);

    if (file) {
      setFile(file);
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
      }

      const reader = new FileReader();
      reader.onload = () => {
        setUserImage(reader.result as string);
        setHaveImage(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (file) {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('image', file);

      toast.promise(uploadUserImage(user.id, formData), {
        loading: 'Uploading image...',
        success: () => {
          setIsDirty(false);
          setIsLoading(false);
          return 'Image uploaded successfully';
        },
        error: 'Failed to upload image',
      });
    } else {
      toast.promise(deleteUserImage(user.id), {
        loading: 'Clearing image...',
        success: () => {
          setIsDirty(false);
          setIsLoading(false);
          return 'Image cleared successfully';
        },
        error: 'Failed to clear image',
      });
    }
  }

  function clearImage() {
    setIsDirty(true);
    setHaveImage(false);
    setUserImage(null);
    setFile(null);
  }

  function resetImage() {
    if (user.image) {
      setIsDirty(false);
      setHaveImage(true);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Dialog>
        <DialogTrigger>
          <Avatar
            showFallback
            size="lg"
            name={user.name}
            src={
              user.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/user/${user.image}`
                : ''
            }
            onClick={resetImage}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Change Profile Picture</DialogHeader>
          <div className="flex flex-1 flex-col space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 px-4 py-16',
                { 'py-4': userImage !== null || haveImage },
              )}
            >
              <form id="user-image-form" onSubmit={onSubmit}>
                <input
                  id="picture"
                  type="file"
                  name="file"
                  accept=".png"
                  {...getInputProps()}
                />
              </form>
              {haveImage ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/user/${user.image}`}
                  alt="Preview"
                  height={200}
                  width={500}
                />
              ) : userImage ? (
                <Image
                  src={userImage}
                  alt="Preview"
                  height={200}
                  width={500}
                  className="rounded-md"
                />
              ) : (
                <div
                  className={cn('flex items-center space-x-4', {
                    'animate-bounce': isDragActive,
                  })}
                >
                  {isDragActive ? <Replace /> : <ImagePlus />}
                  <span>
                    {isDragActive
                      ? 'Drop the files here'
                      : 'Drag & drop or browse'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center">
                {(userImage || haveImage) && (
                  <Button
                    variant="destructive"
                    onClick={clearImage}
                    className="w-full"
                  >
                    Clear Image
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              form="user-image-form"
              type="submit"
              variant="default"
              disabled={!isDirty || isLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
