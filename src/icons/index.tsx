import React from 'react'

type Prop = {
  width?: string,
  height?: string,
  fill?: string,
  stroke?: string,
  className?: string
}



export const IAdd = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="M12 22V2M2 12h20"></path>
  </svg>
)

export const IAggregate = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="M8 15h7V8a7 7 0 1 0-7 7zm8-6H9v7a7 7 0 1 0 7-7z"></path>
  </svg>
)

export const IBlog = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 1c9.925 0 18 8.075 18 18m-5 0c0-7.168-5.832-13-13-13m8 13c0-4.411-3.589-8-8-8m-3 0v8"></path>
  </svg>
)

export const ICodepen = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M12 22.03c-5.53 0-10.03-4.5-10.03-10.03C1.97 6.47 6.47 1.97 12 1.97c5.53 0 10.03 4.5 10.03 10.03 0 5.53-4.5 10.03-10.03 10.03M12 0C5.372 0 0 5.373 0 12c0 6.628 5.372 12 12 12s12-5.372 12-12c0-6.627-5.372-12-12-12m6.144 13.067L16.55 12l1.595-1.067v2.134zm-5.506 4.524v-2.975l2.764-1.849 2.232 1.493-4.996 3.33zM12 13.509 9.745 12 12 10.492 14.255 12 12 13.51zm-.638 4.082L6.366 14.26l2.232-1.493 2.764 1.85v2.974zm-5.506-6.658L7.45 12l-1.595 1.067v-2.134zm5.506-4.523v2.974l-2.764 1.85L6.366 9.74l4.996-3.33zm1.276 0 4.996 3.33-2.232 1.493-2.764-1.85V6.41zm6.776 3.246-.005-.027a.624.624 0 0 0-.011-.054l-.01-.03a.617.617 0 0 0-.052-.12l-.019-.03a.568.568 0 0 0-.08-.101l-.026-.025a.728.728 0 0 0-.036-.03l-.029-.022-.01-.008-6.782-4.521a.637.637 0 0 0-.708 0l-6.782 4.52-.01.009-.03.022a.578.578 0 0 0-.035.03c-.01.008-.017.016-.026.025a.553.553 0 0 0-.099.13.594.594 0 0 0-.021.043l-.014.03c-.007.016-.012.032-.017.047l-.01.031c-.004.018-.008.036-.01.054l-.006.027a.613.613 0 0 0-.006.083v4.522a.57.57 0 0 0 .006.083l.005.028.011.053.01.031c.005.016.01.031.017.047l.014.03a.755.755 0 0 0 .067.111.422.422 0 0 0 .053.062l.026.025a.545.545 0 0 0 .065.052l.01.008 6.782 4.522a.637.637 0 0 0 .708 0l6.782-4.522.01-.008a.711.711 0 0 0 .065-.052c.01-.008.017-.016.026-.025a.611.611 0 0 0 .032-.034l.021-.028a.568.568 0 0 0 .027-.039l.019-.029a.574.574 0 0 0 .021-.042l.014-.031a.443.443 0 0 0 .017-.047l.01-.03a.628.628 0 0 0 .01-.054l.006-.028a.66.66 0 0 0 .006-.083V9.739a.648.648 0 0 0-.006-.083z"></path>
  </svg>
)

export const IEdit = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="m14 4 6 6-6-6zm8.294 1.294c.39.39.387 1.025-.008 1.42L9 20l-7 2 2-7L17.286 1.714a1 1 0 0 1 1.42-.008l3.588 3.588zM3 19l2 2m2-4 8-8"></path>
  </svg>
)

export const IGithub = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" d="M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437.55.102.75-.238.75-.53 0-.26-.009-.952-.014-1.87-3.06.664-3.706-1.475-3.706-1.475-.5-1.27-1.221-1.61-1.221-1.61-.999-.681.075-.668.075-.668 1.105.078 1.685 1.134 1.685 1.134.981 1.68 2.575 1.195 3.202.914.1-.71.384-1.195.698-1.47-2.442-.278-5.01-1.222-5.01-5.437 0-1.2.428-2.183 1.132-2.952-.114-.278-.491-1.397.108-2.91 0 0 .923-.297 3.025 1.127A10.536 10.536 0 0 1 12 6.32a10.49 10.49 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128.6 1.514.223 2.633.11 2.911.705.769 1.13 1.751 1.13 2.952 0 4.226-2.572 5.156-5.022 5.428.395.34.747 1.01.747 2.037 0 1.47-.014 2.657-.014 3.017 0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11"></path>
  </svg>
)

export const IHome = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="m1 11 11-9 11 9m-8 12v-8H9v8m-5 0V9m16 14V9"></path>
  </svg>
)

export const IImage = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="M1 3h22v18H1V3zm5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm17 6-5-6-6 7-3-3-8 8"></path>
  </svg>
)

export const ILinks = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="M16.125 2.42a2.009 2.009 0 0 1 2.84-.001l2.616 2.617a2 2 0 0 1-.001 2.839l-3.705 3.705a2.009 2.009 0 0 1-2.84.001L12.42 8.964a2 2 0 0 1 .001-2.839l3.705-3.705zm-10 10a2.009 2.009 0 0 1 2.84-.001l2.616 2.617a2 2 0 0 1-.001 2.839L7.875 21.58a2.009 2.009 0 0 1-2.84.001L2.42 18.964a2 2 0 0 1 .001-2.839l3.705-3.705zM7 17 17 7"></path>
  </svg>
)

export const IRun = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 11 3 2m0-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM9.5 9.5 9.525 6H15L8 17H4m11-9-3 5 .5 1L17 7.5 15 6m-4 7 5 3.5v5"></path>
  </svg>
)

export const ISearch = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="m15 15 7 7-7-7zm-5.5 2a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"></path>
  </svg>
)

export const ITrash = (props: Prop) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="none" strokeWidth="2" d="M4 5h16v18H4V5zM1 5h22M9 1h6v4H9V1zm0 0h6v4H9V1zm6 8v10M9 9v10"></path>
  </svg>
)


