import clsx from "clsx";

const Wrapper = ({ children, className, shadow = true }) => {
  return (
    <div
      className={clsx(
        "border border-stone-200 overflow-x-auto rounded-xl",
        {
          "shadow-sm": shadow,
        },
        className
      )}
    >
      <table className="w-full table-auto text-left text-sm">{children}</table>
    </div>
  );
};

const Head = ({ children }) => {
  return (
    <thead className="bg-accent sticky top-0 z-10 bg-indigo-900">
      <tr className="uppercase text-sm text-white font-medium">{children}</tr>
    </thead>
  );
};

const HeadCell = ({ children, size, className, ...props }) => {
  return (
    <th
      scope="col"
      className={clsx(
        "border-b group border-stone-200 relative whitespace-nowrap",
        {
          "px-3 py-2": size == "sm",
          "p-4": size != "sm",
        },
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const Body = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const Row = ({ children, onClick }) => {
  return (
    <tr
      className="border-b border-stone-200 last:border-0 transition cursor-pointer"
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

const Cell = ({ children, size, className, ...props }) => {
  return (
    <td
      {...props}
      className={clsx(
        "whitespace-nowrap",
        {
          "px-4 py-3": size != "sm",
          "px-3 py-2": size == "sm",
        },
        className
      )}
    >
      {children}
    </td>
  );
};

export const Table = { Wrapper, Head, HeadCell, Body, Row, Cell };
