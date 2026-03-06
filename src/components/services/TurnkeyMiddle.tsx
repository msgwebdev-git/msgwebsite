"use client";

import { TurnkeyClients } from "./TurnkeyClients";
import { TurnkeyExpertise } from "./TurnkeyExpertise";
import { TurnkeyResults } from "./TurnkeyResults";
import { TurnkeyCases } from "./TurnkeyCases";

import { TurnkeyProcess } from "./TurnkeyProcess";
import { TurnkeyFaq } from "./TurnkeyFaq";

interface TurnkeyMiddleProps {
  namespace: string;
}

export function TurnkeyMiddle({ namespace }: TurnkeyMiddleProps) {
  return (
    <>
      <TurnkeyClients namespace={namespace} />
      <TurnkeyExpertise namespace={namespace} />
      <TurnkeyResults namespace={namespace} />
      <TurnkeyCases namespace={namespace} />

      <TurnkeyProcess />
      <TurnkeyFaq namespace={namespace} />
    </>
  );
}
