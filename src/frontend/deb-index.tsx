import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './app.css';

export async function debIndexLoader({ params }: any) {
  const url = `/api/package`
  const res = await fetch(url)
  const debs = await res.json()
  return { debs }
}

export function DebIndex ({ }: any) {

  const { debs }: any = useLoaderData();
  console.log(debs)

  return (
    <div>
      {debs.sort((a: any, b: any) => a['Package'] > b['Package'] ? 1 : -1 ).map((deb: any) => <div id={deb['Package']}><a href={deb['Package']}>{deb['Package']}</a></div>)}
    </div>
  );
}
