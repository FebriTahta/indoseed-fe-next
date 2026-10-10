"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Fragment } from 'react'

const Footer = () => {
  const pathname = usePathname();

  let footerInfoText = null;
  if (pathname?.includes('/qc/daya-tumbuh')) {
    footerInfoText = "Uji daya tumbuh benih mengacu pada standar ISTA dan ISO 9001:2015 (Klausul 8.5.1) untuk memastikan kualitas benih yang konsisten dan terpercaya.";
  } else if (pathname?.includes('/qc/kemurnian')) {
    footerInfoText = "Uji kemurnian mengikuti standar ISTA Rules dan ISO 665:2020 (Seed Purity Analysis).";
  } else if (pathname?.includes('/qc/kadar-air')) {
    footerInfoText = "Pengujian kadar air mengacu pada prosedur terstandar ISO 665 dan ISTA untuk memastikan daya simpan benih yang optimal.";
  } else if (pathname?.includes('/qc/vigor')) {
    footerInfoText = "Uji vigor mengikuti standar ISTA Rules dan ISO 17799:2016 (Seed Quality - Determination of Vigour)."
  }

  return (
    <Fragment>
      <div className="mt-10"></div>
      <footer className="footer mt-auto py-4 bg-white dark:bg-bodybg border-t border-defaultborder dark:border-defaultborder/10 text-center">
        <div className="container">
          {footerInfoText ? (
            <span className="text-textmuted dark:text-textmuted/50">{footerInfoText}</span>
          ) : (
            <span className="text-textmuted dark:text-textmuted/50"> Copyright © <span className='text-textmuted dark:text-textmuted/50' id="year"> {new Date().getFullYear()} </span>
              <Link href="#!" scroll={false} className="text-dark font-medium">myiamseed.com</Link>. Designed with <span className="bi bi-heart-fill text-danger"></span> by <Link href="https://spruko.com/" scroll={false} target='_blank'>
                <span className="font-medium text-primary">Andre Ade</span>
              </Link> All rights reserved </span>
          )}
        </div>
      </footer>
    </Fragment>
  )
}

export default Footer