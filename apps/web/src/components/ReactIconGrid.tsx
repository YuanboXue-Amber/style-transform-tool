import * as React from "react";
import { Input } from "@fluentui/react-components";
import { makeStyles, shorthands } from "@griffel/react";
import { iconMapping } from "../lib/processIcon";

const useStyles = makeStyles({
  grid: {
    width: "calc(100vw - 20px)",
    maxWidth: "1024px",
    marginLeft: "10px",
    marginRight: "10px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: " flex-start",

    "> span": {
      alignItems: "center",
      color: "#3b3a39",
      display: "flex",
      flexDirection: "column",
      height: "80px",
      justifyContent: "space-around",
      ...shorthands.padding(0),
      width: "80px",
      ...shorthands.overflow("hidden"),

      "> div": {
        fontSize: "11px",
        opacity: "0",
      },

      "&:hover": {
        ...shorthands.overflow("visible"),

        "& div": {
          opacity: "1",
        },
      },
    },
  },

  searchBox: {
    marginLeft: "50px",
    maxWidth: "320px",
    marginBottom: "10px",
  },

  noteText: {
    marginLeft: "50px",
    marginRight: "50px",
    marginBottom: "10px",
  },
});

const useCardStyles = makeStyles({
  root: {
    backgroundColor: "#E5E4E2",
    ...shorthands.border("1px", "solid", "#BCC6CC"),
    display: "flex",
    justifyContent: "space-around",
    minHight: "60px",
    minWidth: "250px",
    ...shorthands.padding("10px"),
    ...shorthands.margin("10px"),
  },
  icon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

const filterIcons = (searchQuery: string) => {
  return iconMapping.filter(({ v0 }) =>
    v0.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
        <V0Icon outline />
        <div>{V0Icon.displayName.split("Icon")[0]}</div>
      </span>
      {V9Icon ? (
        <span className={classes.icon} key={V9Icon.displayName}>
          <V9Icon fontSize={20} />
          <div>
            {V9Icon.displayName.match(/([a-zA-Z]+)(\d+|)(Filled|Regular)/)[1]}
          </div>
        </span>
      ) : (
        "❌ no match"
      )}
    </div>
  );
};

const ReactIconGrid = () => {
  const [search, setSearch] = React.useState("");
  const styles = useStyles();

  const _onSearchQueryChanged = (ev?: React.FormEvent<HTMLInputElement>) => {
    setSearch(ev ? ev.currentTarget.value : "");
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
      <div className={styles.noteText}>
        {"Note: both v0 and v9 Icons are shown as outlined (regular)"}
      </div>
      <div className={styles.noteText}>
        For icons without match, if they are in components-fluent-ui-icons,
        migrate them to components-teams-fluent-ui-icons using{" "}
        <a href="https://domoreexp.visualstudio.com/DefaultCollection/Teamspace/_git/teams-modular-packages?path=/packages/components/components-teams-fluent-ui/docs/components/migrate-Icon.md&version=GC45e240797eefe7f3e28ad10c726fcb782c4aeff0&line=110&lineEnd=111&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents">
          wrapIcon
        </a>
        . Otherwise please contact fluent team.
      </div>
      <div className={styles.grid}>{filteredIcons.map(_renderIcon)}</div>
    </div>
  );
};

export default ReactIconGrid;
