import { h, JSX, ComponentChildren } from 'preact';

import Row from '../../row';
import Cell from '../../cell';
import { classJoin, className } from '../../util/className';
import { TColumn } from '../../types';
import { TD } from './td';
import Header from '../../header';
import { useConfig } from '../../hooks/useConfig';
import useSelector from '../../hooks/useSelector';

export function TR(props: {
  row?: Row;
  messageRow?: boolean;
  children?: ComponentChildren;
}) {
  const config = useConfig();
  const header = useSelector((state) => state.header);
  let is_deleted = false;
  const getColumn = (cellIndex: number): TColumn => {
    if (header) {
      const cols = Header.leafColumns(header.columns);

      if (cols) {
        return cols[cellIndex];
      }
    }

    return null;
  };

  const handleClick = (
    e: JSX.TargetedMouseEvent<HTMLTableRowElement>,
  ): void => {
    if (props.messageRow) return;
    config.eventEmitter.emit('rowClick', e, props.row);
  };

  const getChildren = (): ComponentChildren => {
    if (props.children) {
      return props.children;
    }
    const status_data = props.row.cells[0].data['is_deleted'].toString();
    is_deleted = status_data == '1' ? true : false;
    return props.row.cells.map((cell: Cell, i) => {
      const column = getColumn(i);
      if (column && column.hidden) return null;
      return <TD key={cell.id} cell={cell} row={props.row} column={column} />;
    });
  };
  const childrens = getChildren();
  return (
    <tr
      className={classJoin(className('tr'), is_deleted ? 'gridjs-is_deleted' : config.className.tr)}
      onClick={handleClick}
    >
      {childrens}
    </tr>
  );
}
