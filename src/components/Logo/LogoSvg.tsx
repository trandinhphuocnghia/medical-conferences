export const LogoSvg = ({ title = 'MediOrg' }: { title?: string }) => {
  return (
    <div className="flex items-center gap-4 text-slate-900 dark:text-slate-50">
      <div className="size-8 text-primary">
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4.5 5v6c0 5.55 3.84 10.74 7.5 12 3.66-1.26 7.5-6.45 7.5-12V5L12 2zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V13H5V6.3l7-3.11v9.8z"></path>
        </svg>
      </div>
      <h2 className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em]">
        {title}
      </h2>
    </div>
  )
}
