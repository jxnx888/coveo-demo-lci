import {
  Raw as RawType,
  ResultListState as ResultListStateType,
  Result as ResultType,
  buildResultsPerPage,
} from '@coveo/headless';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Card, CardProps } from '@/components/Card';
import { SearchResultCard, SearchResultCardProps } from '@/components/SearchResultCard';
import { CardGrid, CardGridProps } from '@/components/CardGrid';
import { CardGridItem } from '@/components/CardGrid/CardGridItem';
import { SearchResultsContext } from '@/utils/context/SearchResultsContext';
import { dateNormalizer } from '@/utils/dateNormalizer';
import { COVEO_CATEGORY_PROGRAM, resultList, searchEngine } from '../headless';

import styles from './SearchResultsList.module.css';

export type SearchResultsListProps = {
  variant?: 'default' | 'program' | 'news' | 'events' | 'latestNews',
};

type ResultListResultProps = {
  title: string,
  description: string,
  href: string,
  image: ReactElement,
};

export const NewsEventsList = ['news', 'events', 'latestNews'];

export const isNewsAndEvents = (variant: SearchResultsListProps['variant']) => NewsEventsList.includes(variant as string);

export function SearchResultsList({
  variant = 'default',
}: SearchResultsListProps) {
  const { locale  } = useRouter();

  const { selectedProgramInCategory } = useContext(SearchResultsContext);

  const [results, setResults] = useState<Array<ResultType>>([]);
  const [programs, setPrograms] = useState<Array<ResultType>>([]);

  /* Trigger how mange result per page */
  const numberOfResultsOfPage = {
    default: 10,
    events: 20,
    latestNews: 8,
    news: 20,
    program: 10,
  };
  buildResultsPerPage(searchEngine, {
    initialState: { numberOfResults: numberOfResultsOfPage[variant] },
  });

  const headlessResultList = useMemo(
    () => resultList(),
    /* eslint-disable react-hooks/exhaustive-deps */
    [searchEngine],
  );
  const [resultListState, setResultListState] = useState<ResultListStateType>(
    headlessResultList.state,
  );


  useEffect(
    () => {
      headlessResultList.subscribe(() => setResultListState(headlessResultList.state));
      return headlessResultList.subscribe(() => {});
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [],
  );

  useEffect(
    () => {
      const programsTemp = resultListState.results.filter(
        (item) => item?.raw?.lci_category === COVEO_CATEGORY_PROGRAM,
      );
      const finalData = resultListState.results;
      /* Currently, this is out of scope for now, will enable later.
       *  TODO: the related program is from current data result, not all program data, need to check how to get all program data.
       * */
      /* if (variant === 'default' && selectedProgramInCategory) {
        finalData = resultListState.results.filter(
          (item) => item?.raw?.lci_category !== COVEO_CATEGORY_PROGRAM,
        );
      } */
      setPrograms(programsTemp);
      setResults(finalData);
      if (selectedProgramInCategory) {
        setResults(resultListState.results);
      } else {
        setResults(finalData);
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [resultListState.results, selectedProgramInCategory],
  );

  const randomPlaceholderImage = (themeColor?: string) => {
    const theme = [
      'd485fa',
      'cdc19e',
      'f2f537',
      'cc9f11',
      'fe6c06',
      '685ef7',
      '9cf6d4',
      '5b8000',
    ];
    let cardBackgroundColor = theme[Math.floor(Math.random() * theme.length)];
    if (themeColor) {
      cardBackgroundColor = themeColor.slice(1);
    }
    return `https://flphmoegb.filerobot.com/LCI+Education/Brand+management/Logos+institutions/LCI/LCI+Education/RGB/Logo_LCI_Education_RGB.png?width=510&height=510&func=fit&bg_color=${cardBackgroundColor}&aspect_ratio=1:1`;
  };

  const resultTime = (rawData: RawType) => {
    const startDateArray = (rawData?.lci_start_time as string)?.split(',');
    const endDateArray = (rawData?.lci_end_time as string)?.split(',');
    const startDate = dateNormalizer(startDateArray?.[0], startDateArray?.[1], locale);
    const endDate = dateNormalizer(endDateArray?.[0], endDateArray?.[1], locale);
    const publishDate = dateNormalizer(rawData?.lci_publish_date as string, '', locale);
    const publishDateFormatted = publishDate?.dayjs.format('MMMM DD, YYYY');
    const startYear = startDate?.year;
    const startMonth = startDate?.month;
    const startDay = startDate?.day;
    const endYear = endDate?.year;
    const endMonth = endDate?.month;
    const endDay = endDate?.day;
    let dateRange;
    if (startDate) {
      if (startYear === endYear) {
        if (startMonth === endMonth) {
          if (startDay === endDay) {
            dateRange = `${startMonth} ${startDay}, ${endYear}`;
          } else {
            dateRange = `${startMonth} ${startDay} to ${endDay}, ${endYear}`;
          }
        } else {
          dateRange = `${startMonth} ${startDay} to ${endMonth} ${endDay}, ${endYear}`;
        }
      } else {
        dateRange = `${startMonth} ${startDay}, ${startYear} to ${endMonth} ${endDay}, ${endYear}`;
      }
    }
    const startTime = startDate?.dayjs.format('h:mm A');
    const endTime = endDate?.dayjs.format('h:mm A');
    const timeRange = startTime && (startTime === endTime) ? startTime : `${startTime} - ${endTime}`;
    return {
      dateRange,
      timeRange,
      publishDate: publishDateFormatted,
    };
  };

  const commonData = (result: ResultType): ResultListResultProps => {
    const rawData = result?.raw;
    const imageSrc = (rawData?.lci_hero_image as string)
      || (rawData?.lci_image as string)
      || randomPlaceholderImage(rawData?.lci_theme_color as string);

    return {
      title: rawData?.lci_page_title as string || rawData?.lci_title as string || result?.title,
      description:
        (rawData?.lci_program_description as string) || result?.excerpt,
      href: result?.clickUri,
      image: (
        <img
          alt=""
          src={imageSrc}
          width={100}
          height={100}
        />
      ),
    };
  };

  const programContent = (result: ResultType) => {
    const rawData = result?.raw;
    const diplomas = rawData?.lci_diplomas as string;
    const acronym = rawData?.lci_diplomas_acronym
      ? `(${rawData?.lci_diplomas_acronym as string})`
      : '';
    const location = rawData?.lci_location as string;
    const deliveryModes = (rawData?.lci_delivery_mode as Array<string> | undefined);

    const tags: CardProps['tags'] = diplomas ? (
      <li>
        <strong>{`${diplomas} ${acronym}`}</strong>
      </li>
    ) : undefined;

    const scheduleTexts = (rawData?.lci_schedule as Array<string> | undefined);
    const timeTexts = (rawData?.lci_time as Array<string> | undefined);

    const features = (
      <>
        {rawData?.lci_program_starts && (
          <li>
            {'START_TIME'}
            {' '}
            {rawData?.lci_program_starts as string}
          </li>
        )}
        {(location || deliveryModes?.length) && (
          <li>
            {deliveryModes?.join(', ')}
            {deliveryModes?.length && location ? ' | ' : ''}
            {location}
          </li>
        )}
        {rawData?.lci_teaching_language_sentence && (
          <li>
            {rawData?.lci_teaching_language_sentence as string}
          </li>
        )}
        {(rawData?.lci_duration) && (
          <li>
            {rawData?.lci_duration as string}
          </li>
        )}
        {(rawData?.lci_schedule || rawData?.lci_time) && (
          <li>
            {scheduleTexts?.join(', ')}
            {' '}
            {rawData?.lci_time ? '|' : ''}
            {' '}
            {timeTexts?.join(', ')}
          </li>
        )}
      </>
    );
    const data: CardProps = {
      ...commonData(result),
      tags,
      features,
      isFeaturesEmphasized: false,
    };
    return <CardGridItem key={result?.uniqueId} card={<Card {...data} />} />;
  };



  const categoryData = (result: ResultType) => {
    const rawData = result?.raw;
    const sameProp = {
      tags: (
        <li>
          <strong>
            {(rawData?.lci_category as string || '')}
          </strong>
        </li>
      ),
      linkVariant: 'hidden',
    };
    const timeData = resultTime(rawData);
    if (rawData?.lci_category === 'News') {
      return {
        ...sameProp,
        features: <li>{timeData.publishDate}</li>,
      };
    }
    if (rawData?.lci_category === 'Events') {
      const featureDate = timeData.dateRange;
      return {
        ...sameProp,
        features: featureDate && (
          <li>
            <span>{resultTime(rawData).dateRange}</span>
          </li>
        ),
      };
    }
    return {};
  };

  const defaultContent = (result: ResultType) => {
    const data: SearchResultCardProps = {
      ...commonData(result),
      ...categoryData(result),
    };
    return <CardGridItem key={result?.uniqueId} card={<SearchResultCard {...data} />} />;
  };

  const columns: { [key: string]: CardGridProps['columns'] } = {
    program: '2',
    default: '1',
    events: '4',
    news: '4',
    latestNews: '4',
  };
  const items = (): ReactNode => {
    switch (variant) {
      case 'program':
        return results.map(programContent);
      default:
        return results.map(defaultContent);
    }
  };
  return (
    <CardGrid
      columns={columns[variant]}
      items={items()}
    />
  );
}
