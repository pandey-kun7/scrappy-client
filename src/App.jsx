import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [hacks, setHacks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const handleClick = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://scrappy-server-ulvf.onrender.com/api/hacks/live`
      );

      const res = await response.json();

      if (res.success) {
        setHacks(res.data);
        console.log(res.data);
        setLoading(false);
      } else {
        console.log("No data received");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  handleClick();
  },[]);

  const handleClick = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/hacks/live"
      );

      const res = await response.json();

      if (res.success) {
        setHacks(res.data);
        console.log(res.data);
        setLoading(false);
      } else {
        console.log("No data received");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // handleClick();


  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const getEventsForDate = (day) => {
    return hacks.filter((hack) => {
      if (!hack.reg_started) return false;

      const date = new Date(hack.reg_started);

      return (
        date.getDate() === day &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-center mb-8">
        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          {loading ? "Loading..." : "Click here to load"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Previous
        </button>

        <h1 className="text-3xl font-bold border-amber-200">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>

        <button
          onClick={nextMonth}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-8">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (day) => (
            <div
              key={day}
              className="text-center font-bold py-3 border border-yellow-100"
            >
              {day}
            </div>
          )
        )}

        {Array.from({ length: startWeekday }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const events = getEventsForDate(day);

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`
                min-h-[100px]
                border
                rounded
                p-2
                cursor-pointer
                transition
                ${
                  selectedDate === day
                    ? "border-blue-500 bg-gray-800"
                    : "border-gray-700 hover:bg-gray-900"
                }
              `}
            >
              <div className="font-bold">{day}</div>

              {events.length > 0 && (
                <>
                  <div className="text-green-400 text-xs mt-2">
                    {events.length} event
                    {events.length > 1 ? "s" : ""}
                  </div>

                  <div className="mt-1 text-xs text-gray-300 truncate">
                    {events[0].evnt_name}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate !== null && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Events on {selectedDate}{" "}
            {currentDate.toLocaleString("default", {
              month: "long",
            })}
          </h2>

          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 p-4 rounded">
              No events found for this date.
            </div>
          ) : (
            getEventsForDate(selectedDate).map((event, idx) => (
              <div
                key={`${event.event_name}-${idx}`}
                className="bg-gray-900 border border-gray-700 rounded-lg p-5 mb-5"
              >
                {event.logo_url && (
                  <img
                    src={event.logo_url}
                    alt={event.evnt_name || "event"}
                    className="w-24 h-24 rounded mb-4 object-cover"
                  />
                )}

                {event.evnt_name && (
                  <h3 className="text-xl font-bold mb-3">
                    {event.evnt_name}
                  </h3>
                )}

                {event.location && (
                  <p className="mb-2">
                    <strong>Location:</strong>{" "}
                    {event.location}
                  </p>
                )}

                {event.paid !== undefined && (
                  <p className="mb-2">
                    <strong>Paid:</strong>{" "}
                    {event.paid ? "Yes" : "No"}
                  </p>
                )}

                {event.reg_started && (
                  <p className="mb-2">
                    <strong>Registration Starts:</strong>{" "}
                    {new Date(
                      event.reg_started
                    ).toLocaleString()}
                  </p>
                )}

                {event.reg_ended && (
                  <p className="mb-2">
                    <strong>Registration Ends:</strong>{" "}
                    {new Date(
                      event.reg_ended
                    ).toLocaleString()}
                  </p>
                )}

                {(event.min_team_size ||
                  event.max_team_size) && (
                  <p className="mb-2">
                    <strong>Team Size:</strong>{" "}
                    {event.min_team_size ?? "?"}
                    {" - "}
                    {event.max_team_size ?? "?"}
                  </p>
                )}

                {event.skills &&
                  event.skills.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold mb-2">
                        Skills
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {event.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-800 px-2 py-1 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {event.site && (
                  <a
                    href={event.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-400 hover:text-blue-300"
                  >
                    View Event →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}