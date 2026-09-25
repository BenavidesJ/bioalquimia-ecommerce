import { Box, Checkbox, Heading, Stack } from '@chakra-ui/react'

export interface CatalogFiltersState {
  categories: string[]
}

interface CatalogFiltersProps {
  filters: CatalogFiltersState
  onChange: (filters: CatalogFiltersState) => void
}

const CATEGORY_OPTIONS = [
  { value: 'HOG', label: 'Hogar' },
  { value: 'AUT', label: 'Automotriz' },
]

export function CatalogFilters({ filters, onChange }: CatalogFiltersProps) {
  const isChecked = (value: string) => filters.categories.includes(value)

  const toggle = (value: string, checked: boolean) => {
    const categories = checked
      ? [...filters.categories, value]
      : filters.categories.filter((category) => category !== value)
    onChange({ categories })
  }

  return (
    <Box borderRight="1px solid" borderColor="border.subtle" p={4} minW="230px">
      <Heading size="sm" mb={3}>
        Filtros
      </Heading>
      <Stack gap={2}>
        {CATEGORY_OPTIONS.map((option) => (
          <Checkbox.Root
            key={option.value}
            checked={isChecked(option.value)}
            onCheckedChange={(details) => toggle(option.value, details.checked === true)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{option.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </Box>
  )
}