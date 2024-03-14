'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  title: string;
  description: string;
  meta?: JSX.Element | React.ReactNode | string;
  icon?: JSX.Element | React.ReactNode | string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-4 p-10 md:grid-cols-3 ">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, '')}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              'relative flex overflow-hidden',
              selected?.id === card.id
                ? 'absolute inset-0 z-50 m-auto flex h-1/2 w-full flex-col flex-wrap items-center justify-center rounded-lg md:w-1/2'
                : lastSelected?.id === card.id
                  ? 'z-40 h-full w-full rounded-xl bg-white dark:bg-card'
                  : 'h-full w-full rounded-xl bg-white dark:bg-card',
            )}
            layout
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <div className="flex flex-1 cursor-pointer flex-col space-y-4 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">{card.title}</h1>
                {card.icon}
              </div>
              <h5 className="text-sm text-gray-600">{card.description}</h5>
              <div className="flex flex-1 items-center justify-center">
                {card.meta}
              </div>
            </div>
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          'absolute left-0 top-0 z-10 h-full w-full bg-black opacity-0',
          selected?.id ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="relative z-[60] flex h-full w-full flex-col justify-end rounded-lg bg-white shadow-2xl dark:bg-card">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 z-10 h-full w-full"
      />
      <motion.div
        initial={{
          opacity: 0,
          y: 150,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="relative z-[70] h-full p-4"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
