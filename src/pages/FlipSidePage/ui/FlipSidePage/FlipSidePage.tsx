import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Text } from 'shared/UI/Text';
import { HStack, VStack } from 'shared/UI/Stack';
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from '@radix-ui/react-icons';
import { Route, useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import {
    DataTable,
    DataTableCellClickEvent,
    DataTableRowEditCompleteEvent,
} from 'primereact/datatable';
import { Column, ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';
import { Table } from 'pages/FlipSidePage/ui/Table/Table';
import classes from './FlipSidePage.module.scss';

interface FlipSidePageProps {
    className?: string;
}

const FlipSidePage = memo((props: FlipSidePageProps) => {
    const { className } = props;

    useEffect(() => {
        document.title = 'Подробный расход л/с';
    }, []);

    const navigate = useNavigate();

    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [secondSelectedRow, setSecondSelectedRow] = useState<any>(null);
    const [values, setValues] = useState<any[]>([
        {
            id: 1,
            rank: '',
            names: '',
            division: '',
            reason: '',
            timeLost: '',
        },
    ]);
    const [comandirovkaValues, setComandirovkaValues] = useState<any[]>([
        {
            id: 1,
            rank: '',
            names: '',
            division: '',
            additional: '',
        },
    ]);

    const handleChangePageClick = useCallback(() => {
        navigate(RoutePath.main);
    }, [navigate]);

    const columns = [
        { field: 'id', header: '№ п/п' },
        { field: 'rank', header: 'Воинское звание' },
        { field: 'names', header: 'Фамилия, имя, отчество' },
        { field: 'division', header: 'Подразделение' },
        { field: 'reason', header: 'Причина отсутствия' },
        { field: 'timeLost', header: 'Время отсутствия' },
    ];

    const commandirovka = [
        { field: 'id', header: '№ п/п' },
        { field: 'rank', header: 'Воинское звание' },
        { field: 'names', header: 'Фамилия, имя, отчество' },
        { field: 'division', header: 'К какому подразделению прикомандирован' },
        { field: 'additional', header: 'Примечание' },
    ];

    const handleEditCell = useCallback(
        (options: ColumnEditorOptions) => (
            <InputText
                type="text"
                value={options.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    // @ts-ignore
                    options.editorCallback(e.target.value)
                }
            />
        ),
        [],
    );

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        const _products = [...values];
        const { newData, index } = e;

        _products[index] = newData;

        setValues(_products);
    };

    const onRowEditComplete2 = (e: DataTableRowEditCompleteEvent) => {
        const _products = [...comandirovkaValues];
        const { newData, index } = e;

        _products[index] = newData;

        setComandirovkaValues(_products);
    };

    useEffect(() => {
        if (values.length) {
            if (values[0].division) {
                localStorage.setItem('secondPageData', JSON.stringify(values));
            }
        }
    }, [values]);

    useEffect(() => {
        if (comandirovkaValues.length) {
            if (comandirovkaValues[0].division) {
                localStorage.setItem('secondPageData2', JSON.stringify(comandirovkaValues));
            }
        }
    }, [comandirovkaValues]);

    useEffect(() => {
        const data = localStorage.getItem('secondPageData');
        if (data) {
            setValues(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        const data = localStorage.getItem('secondPageData2');
        if (data) {
            setComandirovkaValues(JSON.parse(data));
        }
    }, []);

    const handleAddRowClick = useCallback(() => {
        setValues((prevState) => {
            const newItem = { id: prevState.length + 1 };
            return [...prevState, newItem].map((item, index) => ({ ...item, id: index + 1 }));
        });
    }, []);

    const handleAddRowClick2 = useCallback(() => {
        setComandirovkaValues((prevState) => {
            const newItem = { id: prevState.length + 1 };
            return [...prevState, newItem].map((item, index) => ({ ...item, id: index + 1 }));
        });
    }, []);

    const saveAsExcelFile = (buffer: Buffer, fileName: string) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                const EXCEL_TYPE =
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                const EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(
                    data,
                    `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`,
                );
            }
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            function renameFields(obj: any, newFieldNames: any) {
                const renamedObj = {};
                for (const key in obj) {
                    const newKey = newFieldNames[key] || key;
                    // @ts-ignore
                    renamedObj[newKey] = obj[key];
                }
                return renamedObj;
            }
            const names = {
                id: '№ п/п',
                rank: 'В/звание',
                names: 'ФИО',
                division: 'Подразделение',
                reason: 'Причина отсутствия',
                timeLost: 'С какого времени отсутствует',
            };

            const worksheet = xlsx.utils.json_to_sheet(
                values.map((value) => renameFields(value, names)),
            );
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });

            saveAsExcelFile(excelBuffer, 'lost_fighters');
        });
    };

    return (
        <Page className={classNames(classes.FlipSidePage, {}, [className])}>
            <img
                draggable={false}
                className={classes.bgImg}
                src="./static/2018.jpg"
                alt="Это фон"
            />

            <VStack maxW className={classes.text}>
                <Text
                    className={classNames('', {}, [classes.text, classes.link])}
                    title="Прикомандированные"
                />
                <Table
                    selectedRow={secondSelectedRow}
                    setSelectedRow={setSecondSelectedRow}
                    values={comandirovkaValues}
                    onRowEditComplete={onRowEditComplete2}
                    columns={commandirovka}
                    handleEditCell={handleEditCell}
                    setValues={setComandirovkaValues}
                />
                <HStack maxW gap="16" justify="end">
                    <Button severity="success" onClick={handleAddRowClick2}>
                        Добавить
                    </Button>
                </HStack>
            </VStack>

            <VStack maxW>
                <Text
                    className={classNames('', {}, [classes.text1, classes.link])}
                    title="Отсутствующие"
                />
                <Table
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    values={values}
                    onRowEditComplete={onRowEditComplete}
                    columns={columns}
                    handleEditCell={handleEditCell}
                    setValues={setValues}
                />
                <HStack maxW gap="16" justify="end">
                    <Button severity="help" onClick={exportExcel}>
                        Сохранить на ПК
                    </Button>
                    <Button severity="success" onClick={handleAddRowClick}>
                        Добавить
                    </Button>
                </HStack>
            </VStack>

            <HStack
                onClick={handleChangePageClick}
                className={classNames('', {}, [classes.header, classes.link])}
                justify="start"
            >
                <ArrowLeftIcon className={classes.icon} />
                <Text size="small" title="Перевернуть страницу" />
            </HStack>
        </Page>
    );
});

export default FlipSidePage;
