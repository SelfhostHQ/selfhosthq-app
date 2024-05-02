import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "SelhostHQ" },
    { name: "description", content: "Backend app to manage my server" },
  ];
};

export default function Index() {
  return (
    <div className="text-center">
      <span>Hello Mathews</span>
     </div>
  );
}
