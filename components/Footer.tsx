import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-28 sm:h-32 w-full sm:pt-2 pt-4 border-t mt-5 flex flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
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
        <div className="text-sm text-gray-600">
          Supported by{" "}
          <a
            href="https://www.anthropic.com/"
            target="_blank"
            rel="noreferrer"
            className="font-bold hover:underline transition underline-offset-2 text-gray-600"
          >
            Claude Sonnet 4.0
          </a>
          {" & "}
          <a
            href="https://kiro.dev/"
            target="_blank"
            rel="noreferrer"
            className="font-bold hover:underline transition underline-offset-2 text-gray-600"
          >
            Kiro
          </a>
        </div>
      </div>

    </footer>
  );
}
