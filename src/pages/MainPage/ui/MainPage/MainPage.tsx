import { Page } from 'widgets/Page/Page';
import { classNames } from 'shared/lib/classNames/classNames';
import { Text } from 'shared/UI/Text';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { HStack } from 'shared/UI/Stack';
import { AppLink } from 'shared/UI/AppLink';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import classes from './MainPage.module.scss';

const MainPage = () => {
    const [expenditure, setExpenditure] = useState({
        id: 1,
        division: '63 курс',
        bs: 120,
        list: 119,
        face: 119,
        duty: 0,
        trip: 0,
        vacation: 0,
        dismissal: 0,
        other: 0,
    });

    const navigate = useNavigate();

    const handleChangePageClick = useCallback(() => {
        navigate('');
    }, [navigate]);

    useEffect(() => {
        const data = localStorage.getItem('data');
        if (data) {
            setExpenditure(JSON.parse(data));
        }
    }, []);

    const columns = useMemo(
        () => [
            { field: 'id', header: '№ п/п' },
            { field: 'division', header: 'Подразделение' },
            { field: 'bs', header: 'По штату' },
            { field: 'list', header: 'По списку' },
            { field: 'face', header: 'На лицо' },
            { field: 'duty', header: 'Наряд' },
            { field: 'trip', header: 'Командировка' },
            { field: 'vacation', header: 'Отпуск' },
            { field: 'dismissal', header: 'Увольнение' },
            { field: 'other', header: 'Прочее' },
        ],
        [],
    );

    const handleEditCell = useCallback(
        (options: ColumnEditorOptions) => (
            <InputNumber
                value={options.value}
                onValueChange={(e: InputNumberValueChangeEvent) =>
                    // @ts-ignore
                    options.editorCallback(Math.abs(~~e.value))
                }
                mode="decimal"
                locale="ru-RU"
            />
        ),
        [],
    );

    const handleCellRecount = useCallback(() => {
        const newFace =
            expenditure.list -
            expenditure.duty -
            expenditure.trip -
            expenditure.vacation -
            expenditure.dismissal -
            expenditure.other;

        setExpenditure({ ...expenditure, face: newFace });
    }, [expenditure]);

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(expenditure));
    }, [expenditure]);

    return (
        <Page className={classNames(classes.MainPage, {}, [])}>
            <img className={classes.bgImg} src="./static/2018.jpg" alt="Это фон" />

            <Text
                className={classes.header}
                title="Развернутая строевая записка 63 курса"
                size="large"
                align="center"
                text={`на ${new Date().toLocaleDateString('ru-RU')}`}
            />

            <DataTable
                className={classes.text}
                showGridlines
                stripedRows
                size="large"
                value={[expenditure]}
                tableStyle={{ textAlign: 'center', minWidth: '50rem' }}
            >
                {columns.map((col, index: number) => (
                    <Column
                        editor={
                            index > 4
                                ? (options) => handleEditCell(options)
                                : (options) => options.value
                        }
                        onCellEditComplete={handleCellRecount}
                        key={col.field}
                        field={col.field}
                        header={col.header}
                    />
                ))}
            </DataTable>

            <HStack
                onClick={handleChangePageClick}
                className={classNames('', {}, [classes.header, classes.link])}
                justify="end"
            >
                <Text title="Перевернуть страницу" />
                <ArrowRightIcon className={classes.icon} />
            </HStack>
        </Page>
    );
};

export default MainPage;
