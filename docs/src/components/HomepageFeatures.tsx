import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

type FeatureItem = {
  title: string;
  svg: JSX.Element;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Turn Key Web App in Minutes",
    svg: (
      <svg style={{ width: "48px", height: "48px" }} viewBox="0 0 24 24">
        <path
          fill="var(--ifm-color-primary)"
          d="M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12S3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z"
        />
      </svg>
    ),
    description: (
      <>
        Web apps include authentication, user management and user settings so
        you can focus on features that add business value
      </>
    ),
  },
  {
    title: "Development Workflow Baked In",
    svg: (
      <svg style={{ width: "48px", height: "48px" }} viewBox="0 0 24 24">
        <path
          fill="var(--ifm-color-primary)"
          d="M22,14H20V16H14V13H16V11H14V6A2,2 0 0,0 12,4H4V2H2V10H4V8H10V11H8V13H10V18A2,2 0 0,0 12,20H20V22H22"
        />
      </svg>
    ),
    description: (
      <>
        CI/CD pipelines and pre-push hooks to enforce secure infrastructure and
        high code quality
      </>
    ),
  },
  {
    title: "Flexible Constructs and Components",
    svg: (
      <svg style={{ width: "48px", height: "48px" }} viewBox="0 0 24 24">
        <path
          fill="var(--ifm-color-primary)"
          d="M19 6V5A2 2 0 0 0 17 3H15A2 2 0 0 0 13 5V6H11V5A2 2 0 0 0 9 3H7A2 2 0 0 0 5 5V6H3V20H21V6Z"
        />
      </svg>
    ),
    description: (
      <>
        CDK Constructs and React Components built for common web app needs on
        AWS help you build new features faster
      </>
    ),
  },
];

function Feature({ title, svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">{svg}</div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
