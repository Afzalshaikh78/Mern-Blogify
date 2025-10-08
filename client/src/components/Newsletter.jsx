import React, { useState } from "react";

import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "error" | "loading"
  const { axios } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const { data } = await axios.post("/api/newsletter/subscribe", { email });
      console.log(data);

      setStatus("success");
      setEmail("");

      toast.success(data.message || "Subscribed successfully!");

      // reset status after 2 seconds
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");

      toast.error(err.response?.data?.message || "Something went wrong");

      // reset status after 2 seconds
      setTimeout(() => setStatus(null), 2000);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Blog!</h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-green-500 mt-2">Thanks for subscribing! 🎉</p>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
};

export default Newsletter;
