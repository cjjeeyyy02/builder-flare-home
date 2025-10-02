import { createContext, useContext, useState } from "react";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ defaultValue, value: controlled, onValueChange, children, className }: any) {
  const isControlled = controlled !== undefined;
  const [uncontrolled, setUncontrolled] = useState<string>(defaultValue ?? "");
  const value = isControlled ? controlled : uncontrolled;
  const setValue = (v: string) => {
    if (!isControlled) setUncontrolled(v);
    onValueChange?.(v);
  };
  return (
    <div className={className}>
      <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>
    </div>
  );
}

export function TabsList({ children, className }: any) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, className, ...props }: any) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      data-state={active ? "active" : "inactive"}
      onClick={() => ctx.setValue(value)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: any) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  return ctx.value === value ? <div className={className}>{children}</div> : null;
}
