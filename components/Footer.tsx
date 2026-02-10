import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-20 sm:h-24 w-full sm:pt-2 pt-4 border-t mt-5 flex flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div className="text-sm text-gray-600 flex flex-col items-center space-y-2">
        <div>
          Powered by{" "}
          <a
            href="https://github.com/guaguaguaxia"
            target="_blank"
            rel="noreferrer"
            className="font-bold hover:underline transition underline-offset-2 text-gray-600"
          >
            guaguaguaxia
          </a>
          {" & "}
          <a
            href="https://xyern.com"
            target="_blank"
            rel="noreferrer"
            className="font-bold hover:underline transition underline-offset-2 text-gray-600"
          >
            laochenfei233
          </a>
        </div>
      </div>

    </footer>
  );
}
