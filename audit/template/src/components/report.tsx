import { useEffect, useState } from 'react';

export default ({ report }: { report: any }) => {
    console.log(report)
  const reports = Object.entries(report).map((entry) => {
    const url = entry[0];
    const result = entry[1] as any;

    return (
      <>
        <h2> {result.title} </h2>

        <h3> Metadatas </h3>
        <dl>
          <dt>URL</dt>
          <dt>{url}</dt>

          <dt>Lang</dt>
          <dt>{result.lang}</dt>
        </dl>

        <h3> List of JavaScript resources </h3>
        <ul>{ result.scripts?.map((script: string) => (<li>{script}</li>))}</ul>

        <h3> List of CSS resources </h3>
        <ul>{ result.links?.map((link: string) => (<li>{link}</li>))}</ul>

        <h3>Rules</h3>

      </>
    );
  });

  return (
    <>
      <h1> Report </h1>
      { reports }
    </>
  );
};
