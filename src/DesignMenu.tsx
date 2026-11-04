import { DropdownMenu } from './vendor/arc/dropdown-menu/dropdown-menu';
import { sitePaths } from './site-paths';

export function DesignMenu({ current, section, triggerClassName, menuClassName }: { current?: boolean; section?: 'overview' | 'components'; triggerClassName: string; menuClassName: string }) {
  return <DropdownMenu label="Design" current={current} openOnHover align="center" triggerClassName={triggerClassName} menuClassName={menuClassName} items={[
    { label: 'Create', current: section === 'overview', onSelect: () => { window.location.href = sitePaths.design; } },
    { label: 'Gallery', current: section === 'components', onSelect: () => { window.location.href = sitePaths.components; } },
  ]}/>;
}
