'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Loading from '@/components/client/Loading';
import { Button, Card, Divider } from '@nextui-org/react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegFileExcel, FaRegFilePdf } from 'react-icons/fa';
import { maintenance } from '@prisma/client';

export default function TaskMaintenance({
  maintenance,
  children,
}: {
  maintenance: maintenance;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Card
      className={`rounded-md p-4 m-4 flex-grow ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}
    >
      <div className="flex flex-row">
        <Button
          className="max-w-min"
          as={Link}
          href="/task"
          startContent={<IoIosArrowBack />}
          variant="faded"
          size="md"
        >
          Back
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center my-4 ">
        <h2 className="text-xl font-semibold">{maintenance.uid}</h2>
        <div className="flex flex-row space-x-1">
          <Button isIconOnly variant="faded">
            <AiOutlineEdit />
          </Button>
          <Button isIconOnly variant="faded">
            <FaRegFilePdf />
          </Button>
          <Button isIconOnly variant="faded">
            <FaRegFileExcel />
          </Button>
        </div>
      </div>
      <Divider />
      <Card className="rounded-md overflow-hidden mt-4">
        <div className="flex flex-col h-screen p-4">
          <div className="flex-shrink-0 w-full">{children}</div>
        </div>
      </Card>
    </Card>
  );
}
