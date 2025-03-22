import Link from "next/link";

export function Navigation() {
  return (
    <nav className="flex items-center space-x-4">
      <Link href="/projects" className="text-gray-600 hover:text-gray-900">
        Projects
      </Link>
    </nav>
  );
} 