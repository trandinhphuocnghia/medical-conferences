export const FooterClient = () => (
  <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        © 2024 MediOrg. All Rights Reserved.
      </p>
      <div className="flex gap-6">
        <a
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Terms of Service
        </a>
      </div>
    </div>
  </footer>
)
