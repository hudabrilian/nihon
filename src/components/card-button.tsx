interface CardButtonProps {
  onClick?: () => void;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function CardButton({
  onClick,
  active = false,
  className = "",
  children,
}: CardButtonProps) {
  return (
    <div
      className={
        "card card-button card-sm shadow-sm " +
        (active
          ? "bg-primary text-primary-content"
          : "bg-base-300 text-base-content") +
        " " +
        className
      }
      onClick={onClick}
    >
      {children}
    </div>
  );
}
