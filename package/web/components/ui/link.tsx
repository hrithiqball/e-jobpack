import NextLink from 'next/link';
import { cva } from 'class-variance-authority';

const linkVariants = cva('', {
  variants: {
    variant: {
      text: 'underline-offset-4 hover:text-blue-500 hover:underline dark:hover:text-blue-300',
      warn: 'text-red-500',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

interface LinkProps {
  href: string;
  variant?: 'text' | 'warn';
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ href, variant = 'text', children }) => {
  const classNames = linkVariants({ variant });

  return (
    <NextLink href={href} className={classNames}>
      {children}
    </NextLink>
  );
};

export { Link, linkVariants };
