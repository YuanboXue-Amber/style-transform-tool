import * as React from 'react';
import { Input } from '@fluentui/react-input';
import { makeStyles, shorthands } from '@griffel/react';
import { iconMapping } from '../lib/processIcon';

const useStyles = makeStyles({
  grid: {
    width: 'calc(100vw - 20px)',
    maxWidth: '1024px',
    marginLeft: '10px',
    marginRight: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: ' flex-start',

    '> span': {
      alignItems: 'center',
      color: '#3b3a39',
      display: 'flex',
      flexDirection: 'column',
      height: '80px',
      justifyContent: 'space-around',
      ...shorthands.padding(0),
      width: '80px',
      ...shorthands.overflow('hidden'),

      '> div': {
        fontSize: '11px',
        opacity: '0',
      },

      '&:hover': {
        ...shorthands.overflow('visible'),

        '& div': {
          opacity: '1',
        },
      },
    },
  },

  searchBox: {
    marginLeft: '50px',
    maxWidth: '320px',
    marginBottom: '10px',
  },
});

const useCardStyles = makeStyles({
  root: {
    backgroundColor: '#E5E4E2',
    ...shorthands.border('1px', 'solid', '#BCC6CC'),
    display: 'flex',
    justifyContent: 'space-around',
    minHight: '60px',
    minWidth: '250px',
    ...shorthands.padding('10px'),
    ...shorthands.margin('10px'),
  },
  icon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const filterIcons = (searchQuery) => {
  return iconMapping.filter(({ v0 }) =>
    v0.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const _renderIcon = ({ v0: V0Icon, v9: V9Icon }): JSX.Element => {
  const classes = useCardStyles();
  return (
    <div
      className={classes.root}
      tabIndex={0}
      aria-label={
        V9Icon
          ? `${V0Icon.displayName} is mapped to ${V9Icon.displayName}`
          : `${V0Icon.displayName} has no match`
      }
    >
      <span className={classes.icon} key={V0Icon.displayName}>
        <V0Icon />
        <div>{V0Icon.displayName.split('Icon')[0]}</div>
      </span>
      {V9Icon ? (
        <span className={classes.icon} key={V9Icon.displayName}>
          <V9Icon fontSize={20} />
          <div>
            {V9Icon.displayName.match(/([a-zA-Z]+)(\d+|)(Filled|Regular)/)[1]}
          </div>
        </span>
      ) : (
        '❌ no match'
      )}
    </div>
  );
};

const ReactIconGrid = () => {
  const [search, setSearch] = React.useState('');
  const styles = useStyles();

  const _onSearchQueryChanged = (ev?: React.FormEvent<HTMLInputElement>) => {
    setSearch(ev ? ev.currentTarget.value : '');
  };

  const filteredIcons = React.useMemo(() => filterIcons(search), [search]);

  return (
    <div>
      <Input
        type="search"
        placeholder="Search icons"
        value={search}
        aria-label="search"
        // eslint-disable-next-line react/jsx-no-bind
        onChange={_onSearchQueryChanged}
        className={styles.searchBox}
      />
      <div className={styles.grid}>{filteredIcons.map(_renderIcon)}</div>
    </div>
  );
};

export default ReactIconGrid;
