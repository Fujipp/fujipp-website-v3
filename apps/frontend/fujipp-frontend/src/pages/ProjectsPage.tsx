interface ColorTokenItem {
  hex: string
  label: string
  token: string
  cardTone?: 'dark' | 'light'
}

interface ColorSection {
  title: string
  items: ColorTokenItem[]
}

const COLOR_SECTIONS: ColorSection[] = [
  {
    title: 'Colors: Base Color',
    items: [
      { hex: '7987AC', label: 'primary', token: '--primary' },
      { hex: '505050', label: 'Secondary', token: '--secondary', cardTone: 'light' },
      { hex: 'FFFFFF', label: 'Background Light', token: '--background-light' },
      { hex: '272727', label: 'Background Dark', token: '--background-dark' },
      { hex: '1C1C1C', label: 'Surface', token: '--surface' },
      { hex: '505050', label: 'Divider', token: '--divider', cardTone: 'light' },
      { hex: '2E9E73', label: 'Success', token: '--success' },
      { hex: 'F2B23A', label: 'Warning', token: '--warning' },
      { hex: 'E14D4D', label: 'Error', token: '--error' },
      { hex: '3B82F6', label: 'Info', token: '--info' },
    ],
  },
  {
    title: 'Colors: Text & Icons',
    items: [
      { hex: 'AEAEAE', label: 'Text-Primary-Light', token: '--text-primary-light', cardTone: 'light' },
      { hex: 'FFFFFF', label: 'Text-Primary-Dark', token: '--text-primary-dark' },
      { hex: '939393', label: 'Text-Secondary-Light', token: '--text-secondary-light', cardTone: 'light' },
      { hex: '939393', label: 'Text-Secondary-Dark', token: '--text-secondary-dark', cardTone: 'light' },
      { hex: '939393 30%', label: 'Text-Muted', token: '--text-muted', cardTone: 'light' },
      { hex: 'A0A0A0', label: 'Text-Disabled', token: '--text-disabled', cardTone: 'light' },
    ],
  },
  {
    title: 'Colors: Forms & Inputs',
    items: [
      { hex: 'FFFFFF', label: 'input-bg', token: '--input-bg' },
      { hex: 'DADDE7', label: 'input-border', token: '--input-border' },
      { hex: 'B9C1D8', label: 'input-border-hover', token: '--input-border-hover' },
      { hex: '7987AC', label: 'input-border-focus', token: '--input-border-focus' },
      { hex: '9AA0AA', label: 'input-placeholder', token: '--input-placeholder', cardTone: 'light' },
      { hex: 'F5F6FA', label: 'input-placeholder-bg', token: '--input-placeholder-bg' },
      { hex: 'F5F6FA', label: 'input-bg-disabled', token: '--input-bg-disabled' },
      { hex: 'E6E8F0', label: 'input-border-disabled', token: '--input-border-disabled' },
      { hex: '000000', label: 'Text-Input', token: '--text-input' },
    ],
  },
  {
    title: 'Colors: Buttons',
    items: [
      { hex: '7987AC', label: 'btn-bg-Primary', token: '--btn-primary-bg' },
      { hex: '6B79A0', label: 'btn-hover-Primary', token: '--btn-primary-hover' },
      { hex: '5E6C94', label: 'btn-active-Primary', token: '--btn-primary-active' },
      { hex: 'C7CEDF', label: 'btn-disabled-Primary', token: '--btn-primary-disabled' },
      { hex: 'FFFFFF', label: 'btn-text-Primary', token: '--btn-primary-text' },
      { hex: '505050', label: 'btn-bg-Secondary', token: '--btn-secondary-bg', cardTone: 'light' },
      { hex: '3F3F3F', label: 'btn-hover-Secondary', token: '--btn-secondary-hover', cardTone: 'light' },
      { hex: '2F2F2F', label: 'btn-active-Secondary', token: '--btn-secondary-active', cardTone: 'light' },
      { hex: 'FFFFFF', label: 'btn-text-Secondary', token: '--btn-secondary-text' },
      { hex: 'E14D4D', label: 'btn-bg-Danger', token: '--btn-danger-bg' },
      { hex: 'C93E3E', label: 'btn-hover-Danger', token: '--btn-danger-hover' },
      { hex: 'A83232', label: 'btn-active-Danger', token: '--btn-danger-active' },
      { hex: 'FFFFFF', label: 'btn-text-Danger', token: '--btn-danger-text' },
    ],
  },
  {
    title: 'Colors: Neutral Scale',
    items: [
      { hex: 'F8F9FB', label: '50', token: '--neutral-50' },
      { hex: 'F1F3F7', label: '100', token: '--neutral-100' },
      { hex: 'E4E7EE', label: '200', token: '--neutral-200' },
      { hex: 'D1D6E0', label: '300', token: '--neutral-300' },
      { hex: 'B6BDCC', label: '400', token: '--neutral-400' },
      { hex: '939DB0', label: '500', token: '--neutral-500' },
      { hex: '6E788E', label: '600', token: '--neutral-600', cardTone: 'light' },
      { hex: '505A70', label: '700', token: '--neutral-700', cardTone: 'light' },
      { hex: '343C4E', label: '800', token: '--neutral-800', cardTone: 'light' },
      { hex: '1C2230', label: '900', token: '--neutral-900' },
    ],
  },
  {
    title: 'Colors: Data Visualization / Pastel (Categorical 8 colors)',
    items: [
      { hex: 'A7B8E8', label: 'Pastel-01', token: '--pastel-1' },
      { hex: '9FD9D3', label: 'Pastel-02', token: '--pastel-2' },
      { hex: 'A8E6B1', label: 'Pastel-03', token: '--pastel-3' },
      { hex: 'F6E3A1', label: 'Pastel-04', token: '--pastel-4' },
      { hex: 'F7C7A3', label: 'Pastel-05', token: '--pastel-5' },
      { hex: 'F5A8A8', label: 'Pastel-06', token: '--pastel-6' },
      { hex: 'C6B4E8', label: 'Pastel-07', token: '--pastel-7' },
      { hex: 'F2B6D4', label: 'Pastel-08', token: '--pastel-8' },
    ],
  },
]

function ColorSwatchCard({ hex, label, token, cardTone = 'dark' }: ColorTokenItem) {
  const cardBackground = cardTone === 'light' ? 'var(--text-disabled)' : 'var(--surface)'

  return (
    <article
      className="flex w-full min-w-0 flex-col gap-2 rounded-[26px] px-4 py-4 text-center md:max-w-[273px]"
      style={{ backgroundColor: cardBackground }}
    >
      <div
        className="h-[104px] w-full rounded-[26px]"
        style={{ backgroundColor: `var(${token})` }}
        aria-hidden="true"
      />
      <p className="mt-1 truncate text-[32px] leading-none font-semibold text-navbar-active-foreground">
        {hex}
      </p>
      <p className="truncate text-sm leading-tight font-light text-navbar-foreground">{label}</p>
    </article>
  )
}

export function ProjectsPage() {
  return (
    <section className="w-full rounded-2xl bg-navbar-bg p-3 md:p-4">
      <div className="grid gap-8">
        {COLOR_SECTIONS.map((section) => (
          <div key={section.title} className="grid gap-3">
            <h2 className="sr-only">{section.title}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(156px,1fr))] gap-2.5 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              {section.items.map((item) => (
                <ColorSwatchCard key={`${section.title}-${item.label}`} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
