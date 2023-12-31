"use client";
type HideClerkBrandingProps = {};
export default function HideClerkBranding({}: HideClerkBrandingProps) {
  return (
    <>
      <style jsx global>
        {`
          .cl-internal-b3fm6y {
            display: none !important;
          }
          .cl-card {
            --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
              0 1px 2px -1px var(--tw-shadow-color);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
              var(--tw-shadow);
          }
        `}
      </style>
    </>
  );
}
