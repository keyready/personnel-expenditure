import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode, useRef } from 'react';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { ContextMenu } from 'primereact/contextmenu';
import { TrashIcon } from '@radix-ui/react-icons';
import classes from './Table.module.scss';

interface TableProps {
    className?: string;
    selectedRow: any;
    setSelectedRow: (row: any) => void;
    values: any[];
    onRowEditComplete: (event: DataTableRowEditCompleteEvent) => void;
    columns: any[];
    handleEditCell: (options: ColumnEditorOptions) => ReactNode;
    setValues: (arry: any) => any;
}

export const Table = memo((props: TableProps) => {
    const {
        className,
        values,
        columns,
        handleEditCell,
        onRowEditComplete,
        setSelectedRow,
        selectedRow,
        setValues,
    } = props;

    const cm = useRef<ContextMenu>(null);

    const menuModel = [
        {
            label: 'Удалить',
            icon: <TrashIcon />,
            command: () => {
                setValues((prevState: any) => {
                    const newValues = prevState.filter((value: any) => value.id !== selectedRow.id);
                    return newValues.map((item: any, index: any) => ({ ...item, id: index + 1 }));
                });
            },
        },
    ];

    return (
        <>
            <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedRow(null)} />

            <DataTable
                // @ts-ignore
                onContextMenu={(e) => cm.current.show(e.originalEvent)}
                contextMenuSelection={selectedRow}
                onContextMenuSelectionChange={(e) => setSelectedRow(e.value)}
                style={{ width: '100%', height: 250 }}
                scrollable
                scrollHeight="250px"
                value={values}
                showGridlines
                stripedRows
                size="large"
                editMode="row"
                onRowEditComplete={onRowEditComplete}
            >
                {columns.map((col, index: number) => (
                    <Column
                        sortable
                        editor={handleEditCell}
                        key={col.field}
                        field={col.field}
                        header={col.header}
                    />
                ))}
                <Column rowEditor />
            </DataTable>
        </>
    );
});
