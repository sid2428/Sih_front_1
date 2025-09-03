import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 px-6 bg-slate-100 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <span className="mb-2 md:mb-0">Powered by ARGO • Mock demo</span>
        <span>© 2023 ARGO. All rights reserved.</span>
      </div>
    </footer>
  );
}
