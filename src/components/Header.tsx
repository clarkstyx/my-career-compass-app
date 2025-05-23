
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Briefcase className="h-6 w-6" />
          <span>CareerCompass</span>
        </Link>
        {/* Add navigation links here if needed in the future */}
      </div>
    </header>
  );
}
