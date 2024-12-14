/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";

import { rhythm } from "../utils/typography";

const Bio = () => {
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <p>
        Written by Matthew Curtis - community organizer, artist, and developer in
        Fayetteville, AR.
        {` `}
        Here are my <a href="https://h-e.io/">links</a>.
      </p>
    </div>
  );
};

export default Bio;
