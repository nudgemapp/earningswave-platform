export type EarningsCallTranscript = {
    _id: {
      $oid: string;
    };
    href: string;
    date: string;
    title: string;
    company_info: {
      company_name: string;
      ticker_symbol: string;
      ticker_change: string;
      date: string;
      time: string;
      logo_base64: string;
    };
    contents: string[];
    sections: Record<string, SectionDetail[]>;
    call_participants: string[];
    full_text: string;
  };
  
  export type SectionDetail = {
    name: string;
    role: string | null;
    text: string;
  };