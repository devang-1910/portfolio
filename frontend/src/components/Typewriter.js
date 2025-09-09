import React from "react";

export default function Typewriter({
  words = [],
  typingSpeed = 120,
  deletingSpeed = 60,
  holdTime = 1200,
}) {
  const [index, setIndex] = React.useState(0);       // which word
  const [text, setText] = React.useState("");        // visible substring
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = words[index % words.length] || "";
    const doneTyping = text === current;
    const doneDeleting = text === "";

    let timeout = typingSpeed;

    if (!deleting && !doneTyping) {
      // type forward
      timeout = typingSpeed;
      const next = current.slice(0, text.length + 1);
      const id = setTimeout(() => setText(next), timeout);
      return () => clearTimeout(id);
    }

    if (!deleting && doneTyping) {
      // hold before delete
      const id = setTimeout(() => setDeleting(true), holdTime);
      return () => clearTimeout(id);
    }

    if (deleting && !doneDeleting) {
      // delete backwards
      timeout = deletingSpeed;
      const next = current.slice(0, text.length - 1);
      const id = setTimeout(() => setText(next), timeout);
      return () => clearTimeout(id);
    }

    if (deleting && doneDeleting) {
      // next word
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, holdTime]);

  return (
    <span className="text-purple-400">
      {text}
      <span className="ml-1 inline-block h-6 align-middle border-r-2 border-purple-400 animate-pulse" />
    </span>
  );
}
