import React, { useState, useEffect } from "react";
import Header from "./components/header/header";
import Title from "./components/title/title";
import Search from "./components/search/search";
import Events from "./components/events/events";
import { getEvents, ethToUsd } from "./utils/utils";
import { useContractRead, useAccount } from "wagmi";
import abi from "./utils/abi.json";
import { contract, ticketsFromUser } from "./utils/config";

function App() {
  const { address } = useAccount();
  const [eventsSplit, setEventsSplit] = useState([]);
  const [rate, setRate] = useState(0);
  const [filter, setFilter] = useState({});
  const [reloadEvents, setReloadEvents] = useState(false);

  const { data: userEvents, isSuccess: userEventsIsSuccess } = useContractRead({
    address: contract,
    abi: abi,
    functionName: ticketsFromUser,
    args: [address],
  });
  const handleReloadEvents = () => {
    setReloadEvents(!reloadEvents);
  };
  useEffect(() => {
    const fetchData = async () => {
      const events = await getEvents(filter.owner, filter.name);
      const rate = await ethToUsd();
      if (userEventsIsSuccess && filter.assistant) {
        let array = [];
        userEvents.map((e) => array.push(e.toNumber()));
        events.filter((d) => array.includes(d.id));
      }
      const chunkSize = 4;
      const eventsSplit = [];
      for (let i = 0; i < events.length; i += chunkSize) {
        eventsSplit.push(events.slice(i, i + chunkSize));
      }
      setEventsSplit(eventsSplit);
      setRate(rate.USD);
    };
    fetchData().catch(console.error);
  }, [filter, userEventsIsSuccess, reloadEvents, userEvents]);

  const reset = () => {
    setFilter({});
  };
  return (
    <div className="App">
      <Header
        setFilter={setFilter}
        onReset={reset}
        reloadEvents={handleReloadEvents}
      />
      <br />
      <Title />
      <br />
      <Search setFilter={setFilter} />
      <br />
      {eventsSplit && <Events rate={rate} events={eventsSplit} />}
    </div>
  );
}

export default App;
