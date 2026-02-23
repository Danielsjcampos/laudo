import { cn } from '../../lib/utils';
import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>{children}</SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider
      open={open}
      setOpen={setOpen}
      animate={animate}
    >
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }: any) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        'z-50 flex h-full flex-shrink-0 flex-col border-r border-neutral-800 bg-[#0a0a0a] px-4 py-4 transition-all duration-300',
        className
      )}
      animate={{
        width: animate ? (open ? '200px' : '64px') : '64px',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, 'to'> & { to?: string }) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      className={cn(
        'group/sidebar flex items-center justify-start gap-2 rounded-md py-2 px-1 transition-colors hover:bg-neutral-800',
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          width: animate ? (open ? 'auto' : 0) : 'auto',
          opacity: animate ? (open ? 1 : 0) : 1,
          marginLeft: animate ? (open ? 8 : 0) : 8,
        }}
        className="!m-0 inline-block overflow-hidden whitespace-pre !p-0 text-sm text-neutral-300 transition duration-150 group-hover/sidebar:translate-x-1"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
