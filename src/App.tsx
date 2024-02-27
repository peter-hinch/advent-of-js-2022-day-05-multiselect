import React, { useState, useEffect } from 'react';

import 'normalize.css';

import './App.css';

import podastCover from './assets/images/podcast-cover.png';

interface Episode {
  id: number;
  title: string;
}

interface Selection {
  id: number;
  selected: boolean;
}

const episodes = [
  { id: 1, title: 'Trailer' },
  { id: 2, title: "James Q Quick's Origin Story" },
  { id: 3, title: "Amy Dutton's Origin Story" },
  { id: 4, title: 'Tech Behind the Podcast' },
  { id: 5, title: 'Tech Behind SelfTeach.me' },
  { id: 6, title: 'Freelancing (Part 1)' },
  { id: 7, title: 'Freelancing (Part 2)' },
  { id: 8, title: 'The Tech Behind jamesqquick.com' },
  { id: 9, title: 'The Tech Behind SelfTeach.me' },
  { id: 10, title: 'Design Fundamentals (Part 1)' },
  { id: 11, title: 'Design Fundamentals (Part 2)' }
];

const seedSelections = () => {
  return episodes.map((ep) => ({ id: ep.id, selected: false }));
};

const App: React.FC<{}> = ({}) => {
  const [selections, setSelections] = useState<Selection[]>(seedSelections());
  const [lastSelection, setLastSelection] = useState<Selection | undefined>();
  const [isShiftDown, setIsShiftDown] = useState<boolean>(false);

  // Add an event listener to handle key presses anywhere on the page
  // Reference: https://stackoverflow.com/questions/61740073/how-to-detect-keydown-anywhere-on-page-in-a-react-app
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      (event?.code === 'ShiftLeft' && !event?.repeat) ||
      (event?.code === 'ShiftRight' && !event?.repeat)
    ) {
      setIsShiftDown(true);
    }
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event?.code === 'ShiftLeft' || event?.code === 'ShiftRight') {
      setIsShiftDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleChecked = (id: number, value: boolean) => {
    const newSelections = [...selections];
    const newIndex = selections.findIndex((sel) => sel.id === id);
    const newSelection = { id, selected: value };
    if (isShiftDown) {
      // Fill selections between last selection and new selection using the
      // 'selected' value from the new selection
      const lastIndex = selections.findIndex(
        (sel) => sel.id === lastSelection?.id
      );
      const range = [lastIndex, newIndex].sort((a, b) => a - b);
      console.log(range);
      for (let i = range[0]; i++; i < range[1]) {}
    } else {
      // Replace an existing value with 1x new value
      newSelections.splice(newIndex, 1, newSelection);
    }
    setSelections(newSelections);
    setLastSelection(newSelection);
  };

  return (
    <main>
      <section className="podcast">
        <div className="podcast__cover">
          <img src={podastCover} alt="compressed.fm podcast cover" />
        </div>
        <div className="podcast__episodes">
          <h2 className="episodes__heading">
            Listen to all the compressed.fm episodes
          </h2>
          <ul>
            {episodes.map((ep) => {
              const selected = selections.find(
                (sel) => sel.id === ep.id
              )?.selected;
              return (
                <PodcastEpisode
                  key={`podcast-ep-${ep.id}`}
                  id={ep.id}
                  title={ep.title}
                  checked={selected || false}
                  handleChecked={handleChecked}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};

const PodcastEpisode: React.FC<
  Episode & { checked: boolean; handleChecked: any }
> = ({ id, title, checked, handleChecked }) => {
  const idString = `episode${id?.toString()?.padStart(2, '0')}`;

  return (
    <li>
      <input
        type="checkbox"
        id={idString}
        checked={checked}
        onChange={() => handleChecked(id, !checked)}
      />
      <label htmlFor={idString}>
        {id} || {title}
      </label>
    </li>
  );
};

export default App;
