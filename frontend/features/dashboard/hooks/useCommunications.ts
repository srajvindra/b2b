"use client";

import { useState, useMemo } from "react";
import { mockCommunications } from "../data/mockCommunications";
import type { Communication, CommSummary } from "../types";

function isUnresponded(c: Communication): boolean {
  if (!c.read || c.responded) return false;
  const now = new Date();
  const hoursSinceReceived =
    (now.getTime() - c.receivedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceReceived >= 24;
}

function isPending(c: Communication): boolean {
  return !c.read || isUnresponded(c);
}

export function useCommunications(selectedStaff: string | null) {
  const [selectedTile, setSelectedTile] = useState<
    "emails" | "sms" | "calls" | null
  >(null);
  const [subFilter, setSubFilter] = useState<"all" | "unread" | "unresponded">(
    "all",
  );

  const baseFilteredCommunications = useMemo(() => {
    return mockCommunications.filter((c) => {
      const matchesStaff = selectedStaff
        ? c.assignedTo === selectedStaff
        : true;
      return matchesStaff;
    });
  }, [selectedStaff]);

  const emailComms = useMemo(
    () => baseFilteredCommunications.filter((c) => c.type === "email"),
    [baseFilteredCommunications],
  );
  const smsComms = useMemo(
    () => baseFilteredCommunications.filter((c) => c.type === "text"),
    [baseFilteredCommunications],
  );
  const callComms = useMemo(
    () => baseFilteredCommunications.filter((c) => c.type === "call"),
    [baseFilteredCommunications],
  );

  const commSummary = useMemo(
    (): CommSummary => ({
      pending:
        emailComms.filter(isPending).length +
        smsComms.filter(isPending).length +
        callComms.filter(isUnresponded).length,
      emails: emailComms.filter(isPending).length,
      emailsUnread: emailComms.filter((c) => !c.read).length,
      emailsUnresponded: emailComms.filter(isUnresponded).length,
      sms: smsComms.filter(isPending).length,
      smsUnread: smsComms.filter((c) => !c.read).length,
      smsUnresponded: smsComms.filter(isUnresponded).length,
      calls: callComms.filter(isUnresponded).length,
    }),
    [emailComms, smsComms, callComms],
  );

  const filteredCommunications = useMemo(() => {
    return baseFilteredCommunications.filter((c) => {
      if (selectedTile === "emails" && c.type !== "email") return false;
      if (selectedTile === "sms" && c.type !== "text") return false;
      if (selectedTile === "calls" && c.type !== "call") return false;
      if (subFilter === "unread") return !c.read;
      if (subFilter === "unresponded") return isUnresponded(c);
      if (!selectedTile) {
        if (c.type === "call") return isUnresponded(c) || !c.read;
        return isPending(c);
      }
      if (selectedTile === "calls") return isUnresponded(c) || !c.read;
      return isPending(c);
    });
  }, [baseFilteredCommunications, selectedTile, subFilter]);

  return {
    filteredCommunications,
    selectedTile,
    setSelectedTile,
    subFilter,
    setSubFilter,
    commSummary,
    isUnresponded,
    isPending,
    baseFilteredCommunications,
    emailComms,
    smsComms,
    callComms,
  };
}
