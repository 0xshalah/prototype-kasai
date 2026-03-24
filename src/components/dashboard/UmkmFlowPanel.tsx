"use client";

import { FlowController } from "./flow/FlowController";

interface UmkmFlowPanelProps {
  onCommitSuccess?: () => void;
  onSwitchToBank?: () => void;
}

export function UmkmFlowPanel(props: UmkmFlowPanelProps) {
  return <FlowController {...props} />;
}
