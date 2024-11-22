create type "public"."MIC" as enum ('XNYS', 'XNAS');

create type "public"."MarketTime" as enum ('BMO', 'AMC', 'DMH', 'UNKNOWN');

create type "public"."TranscriptStatus" as enum ('SCHEDULED', 'COMPLETED', 'CANCELLED');

create table "public"."Company" (
    "id" text not null,
    "symbol" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
    "currency" text not null,
    "description" text not null,
    "displaySymbol" text not null,
    "figi" text,
    "isin" text,
    "mic" "MIC" not null,
    "shareClassFIGI" text,
    "symbol2" text,
    "type" text not null,
    "country" text,
    "exchange" text,
    "finnhubIndustry" text,
    "ipo" timestamp(3) without time zone,
    "logo" text,
    "marketCapitalization" double precision,
    "name" text,
    "phone" text,
    "sharesOutstanding" double precision,
    "weburl" text
);


create table "public"."Email" (
    "id" text not null,
    "address" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


create table "public"."Invoice" (
    "id" text not null,
    "invoice_id" text not null,
    "subscription_id" text not null,
    "amount_paid" integer not null,
    "currency" text,
    "status" text not null,
    "email" text not null,
    "user_id" text not null,
    "period_start" timestamp(3) without time zone not null,
    "period_end" timestamp(3) without time zone not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


create table "public"."Participant" (
    "id" text not null,
    "transcriptId" text not null,
    "name" text not null,
    "role" text,
    "description" text
);


create table "public"."Payment" (
    "id" text not null,
    "user_id" text not null,
    "stripe_id" text not null,
    "email" text not null,
    "amount" double precision not null,
    "customer_details" text not null,
    "payment_intent" text not null,
    "payment_time" timestamp(3) without time zone not null,
    "currency" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


create table "public"."Speech" (
    "id" text not null,
    "participantId" text not null,
    "content" text not null,
    "sequence" integer not null,
    "sessionType" text,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


create table "public"."Subscription" (
    "id" text not null,
    "subscription_id" text not null,
    "stripe_user_id" text not null,
    "status" text not null,
    "start_date" timestamp(3) without time zone not null,
    "end_date" timestamp(3) without time zone not null,
    "plan_id" text not null,
    "default_payment_method_id" text,
    "email" text,
    "user_id" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


create table "public"."Transcript" (
    "id" text not null,
    "companyId" text not null,
    "title" text,
    "scheduledAt" timestamp(3) without time zone not null,
    "quarter" integer,
    "year" integer,
    "audioUrl" text,
    "status" "TranscriptStatus" not null,
    "fullText" text,
    "speakers" jsonb,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
    "MarketTime" "MarketTime" not null,
    "epsActual" double precision,
    "epsEstimate" double precision,
    "revenueActual" double precision,
    "revenueEstimate" double precision,
    "aiKeyPoints" jsonb,
    "aiLastUpdated" timestamp(3) without time zone,
    "aiSentimentAnalysis" jsonb,
    "aiSummary" text
);


create table "public"."User" (
    "id" text not null,
    "email" text,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
    "firstName" text,
    "lastName" text
);


create table "public"."WatchlistEntry" (
    "id" text not null,
    "userId" text not null,
    "companyId" text not null,
    "addedAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
);


CREATE INDEX "Company_exchange_idx" ON public."Company" USING btree (exchange);

CREATE UNIQUE INDEX "Company_figi_key" ON public."Company" USING btree (figi);

CREATE UNIQUE INDEX "Company_isin_key" ON public."Company" USING btree (isin);

CREATE INDEX "Company_marketCapitalization_idx" ON public."Company" USING btree ("marketCapitalization");

CREATE UNIQUE INDEX "Company_pkey" ON public."Company" USING btree (id);

CREATE UNIQUE INDEX "Company_shareClassFIGI_key" ON public."Company" USING btree ("shareClassFIGI");

CREATE INDEX "Company_symbol_idx" ON public."Company" USING btree (symbol);

CREATE UNIQUE INDEX "Company_symbol_mic_key" ON public."Company" USING btree (symbol, mic);

CREATE INDEX "Company_symbol_name_idx" ON public."Company" USING btree (symbol, name);

CREATE INDEX "Company_symbol_type_mic_idx" ON public."Company" USING btree (symbol, type, mic);

CREATE UNIQUE INDEX "Email_address_key" ON public."Email" USING btree (address);

CREATE UNIQUE INDEX "Email_pkey" ON public."Email" USING btree (id);

CREATE UNIQUE INDEX "Invoice_invoice_id_key" ON public."Invoice" USING btree (invoice_id);

CREATE UNIQUE INDEX "Invoice_pkey" ON public."Invoice" USING btree (id);

CREATE UNIQUE INDEX "Participant_pkey" ON public."Participant" USING btree (id);

CREATE INDEX "Participant_transcriptId_idx" ON public."Participant" USING btree ("transcriptId");

CREATE UNIQUE INDEX "Participant_transcriptId_name_key" ON public."Participant" USING btree ("transcriptId", name);

CREATE UNIQUE INDEX "Payment_pkey" ON public."Payment" USING btree (id);

CREATE UNIQUE INDEX "Payment_stripe_id_key" ON public."Payment" USING btree (stripe_id);

CREATE INDEX "Speech_participantId_idx" ON public."Speech" USING btree ("participantId");

CREATE UNIQUE INDEX "Speech_participantId_sequence_key" ON public."Speech" USING btree ("participantId", sequence);

CREATE UNIQUE INDEX "Speech_pkey" ON public."Speech" USING btree (id);

CREATE INDEX "Speech_sessionType_idx" ON public."Speech" USING btree ("sessionType");

CREATE UNIQUE INDEX "Subscription_pkey" ON public."Subscription" USING btree (id);

CREATE UNIQUE INDEX "Subscription_stripe_user_id_key" ON public."Subscription" USING btree (stripe_user_id);

CREATE UNIQUE INDEX "Subscription_subscription_id_key" ON public."Subscription" USING btree (subscription_id);

CREATE UNIQUE INDEX "Subscription_user_id_key" ON public."Subscription" USING btree (user_id);

CREATE INDEX "Transcript_companyId_scheduledAt_idx" ON public."Transcript" USING btree ("companyId", "scheduledAt");

CREATE UNIQUE INDEX "Transcript_companyId_scheduledAt_key" ON public."Transcript" USING btree ("companyId", "scheduledAt");

CREATE INDEX "Transcript_companyId_scheduledAt_status_idx" ON public."Transcript" USING btree ("companyId", "scheduledAt", status);

CREATE UNIQUE INDEX "Transcript_id_key" ON public."Transcript" USING btree (id);

CREATE UNIQUE INDEX "Transcript_pkey" ON public."Transcript" USING btree (id);

CREATE INDEX "Transcript_scheduledAt_status_idx" ON public."Transcript" USING btree ("scheduledAt", status);

CREATE INDEX "Transcript_scheduledAt_status_quarter_idx" ON public."Transcript" USING btree ("scheduledAt", status, quarter);

CREATE INDEX "Transcript_status_scheduledAt_idx" ON public."Transcript" USING btree (status, "scheduledAt");

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE INDEX "WatchlistEntry_companyId_idx" ON public."WatchlistEntry" USING btree ("companyId");

CREATE UNIQUE INDEX "WatchlistEntry_pkey" ON public."WatchlistEntry" USING btree (id);

CREATE UNIQUE INDEX "WatchlistEntry_userId_companyId_key" ON public."WatchlistEntry" USING btree ("userId", "companyId");

CREATE INDEX "WatchlistEntry_userId_idx" ON public."WatchlistEntry" USING btree ("userId");

alter table "public"."Company" add constraint "Company_pkey" PRIMARY KEY using index "Company_pkey";

alter table "public"."Email" add constraint "Email_pkey" PRIMARY KEY using index "Email_pkey";

alter table "public"."Invoice" add constraint "Invoice_pkey" PRIMARY KEY using index "Invoice_pkey";

alter table "public"."Participant" add constraint "Participant_pkey" PRIMARY KEY using index "Participant_pkey";

alter table "public"."Payment" add constraint "Payment_pkey" PRIMARY KEY using index "Payment_pkey";

alter table "public"."Speech" add constraint "Speech_pkey" PRIMARY KEY using index "Speech_pkey";

alter table "public"."Subscription" add constraint "Subscription_pkey" PRIMARY KEY using index "Subscription_pkey";

alter table "public"."Transcript" add constraint "Transcript_pkey" PRIMARY KEY using index "Transcript_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."WatchlistEntry" add constraint "WatchlistEntry_pkey" PRIMARY KEY using index "WatchlistEntry_pkey";

alter table "public"."Invoice" add constraint "Invoice_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES "Subscription"(subscription_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Invoice" validate constraint "Invoice_subscription_id_fkey";

alter table "public"."Invoice" add constraint "Invoice_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Invoice" validate constraint "Invoice_user_id_fkey";

alter table "public"."Participant" add constraint "Participant_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Participant" validate constraint "Participant_transcriptId_fkey";

alter table "public"."Speech" add constraint "Speech_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Speech" validate constraint "Speech_participantId_fkey";

alter table "public"."Subscription" add constraint "Subscription_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Subscription" validate constraint "Subscription_user_id_fkey";

alter table "public"."Transcript" add constraint "Transcript_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Transcript" validate constraint "Transcript_companyId_fkey";

alter table "public"."WatchlistEntry" add constraint "WatchlistEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."WatchlistEntry" validate constraint "WatchlistEntry_companyId_fkey";

alter table "public"."WatchlistEntry" add constraint "WatchlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."WatchlistEntry" validate constraint "WatchlistEntry_userId_fkey";

grant delete on table "public"."Company" to "anon";

grant insert on table "public"."Company" to "anon";

grant references on table "public"."Company" to "anon";

grant select on table "public"."Company" to "anon";

grant trigger on table "public"."Company" to "anon";

grant truncate on table "public"."Company" to "anon";

grant update on table "public"."Company" to "anon";

grant delete on table "public"."Company" to "authenticated";

grant insert on table "public"."Company" to "authenticated";

grant references on table "public"."Company" to "authenticated";

grant select on table "public"."Company" to "authenticated";

grant trigger on table "public"."Company" to "authenticated";

grant truncate on table "public"."Company" to "authenticated";

grant update on table "public"."Company" to "authenticated";

grant delete on table "public"."Company" to "service_role";

grant insert on table "public"."Company" to "service_role";

grant references on table "public"."Company" to "service_role";

grant select on table "public"."Company" to "service_role";

grant trigger on table "public"."Company" to "service_role";

grant truncate on table "public"."Company" to "service_role";

grant update on table "public"."Company" to "service_role";

grant delete on table "public"."Email" to "anon";

grant insert on table "public"."Email" to "anon";

grant references on table "public"."Email" to "anon";

grant select on table "public"."Email" to "anon";

grant trigger on table "public"."Email" to "anon";

grant truncate on table "public"."Email" to "anon";

grant update on table "public"."Email" to "anon";

grant delete on table "public"."Email" to "authenticated";

grant insert on table "public"."Email" to "authenticated";

grant references on table "public"."Email" to "authenticated";

grant select on table "public"."Email" to "authenticated";

grant trigger on table "public"."Email" to "authenticated";

grant truncate on table "public"."Email" to "authenticated";

grant update on table "public"."Email" to "authenticated";

grant delete on table "public"."Email" to "service_role";

grant insert on table "public"."Email" to "service_role";

grant references on table "public"."Email" to "service_role";

grant select on table "public"."Email" to "service_role";

grant trigger on table "public"."Email" to "service_role";

grant truncate on table "public"."Email" to "service_role";

grant update on table "public"."Email" to "service_role";

grant delete on table "public"."Invoice" to "anon";

grant insert on table "public"."Invoice" to "anon";

grant references on table "public"."Invoice" to "anon";

grant select on table "public"."Invoice" to "anon";

grant trigger on table "public"."Invoice" to "anon";

grant truncate on table "public"."Invoice" to "anon";

grant update on table "public"."Invoice" to "anon";

grant delete on table "public"."Invoice" to "authenticated";

grant insert on table "public"."Invoice" to "authenticated";

grant references on table "public"."Invoice" to "authenticated";

grant select on table "public"."Invoice" to "authenticated";

grant trigger on table "public"."Invoice" to "authenticated";

grant truncate on table "public"."Invoice" to "authenticated";

grant update on table "public"."Invoice" to "authenticated";

grant delete on table "public"."Invoice" to "service_role";

grant insert on table "public"."Invoice" to "service_role";

grant references on table "public"."Invoice" to "service_role";

grant select on table "public"."Invoice" to "service_role";

grant trigger on table "public"."Invoice" to "service_role";

grant truncate on table "public"."Invoice" to "service_role";

grant update on table "public"."Invoice" to "service_role";

grant delete on table "public"."Participant" to "anon";

grant insert on table "public"."Participant" to "anon";

grant references on table "public"."Participant" to "anon";

grant select on table "public"."Participant" to "anon";

grant trigger on table "public"."Participant" to "anon";

grant truncate on table "public"."Participant" to "anon";

grant update on table "public"."Participant" to "anon";

grant delete on table "public"."Participant" to "authenticated";

grant insert on table "public"."Participant" to "authenticated";

grant references on table "public"."Participant" to "authenticated";

grant select on table "public"."Participant" to "authenticated";

grant trigger on table "public"."Participant" to "authenticated";

grant truncate on table "public"."Participant" to "authenticated";

grant update on table "public"."Participant" to "authenticated";

grant delete on table "public"."Participant" to "service_role";

grant insert on table "public"."Participant" to "service_role";

grant references on table "public"."Participant" to "service_role";

grant select on table "public"."Participant" to "service_role";

grant trigger on table "public"."Participant" to "service_role";

grant truncate on table "public"."Participant" to "service_role";

grant update on table "public"."Participant" to "service_role";

grant delete on table "public"."Payment" to "anon";

grant insert on table "public"."Payment" to "anon";

grant references on table "public"."Payment" to "anon";

grant select on table "public"."Payment" to "anon";

grant trigger on table "public"."Payment" to "anon";

grant truncate on table "public"."Payment" to "anon";

grant update on table "public"."Payment" to "anon";

grant delete on table "public"."Payment" to "authenticated";

grant insert on table "public"."Payment" to "authenticated";

grant references on table "public"."Payment" to "authenticated";

grant select on table "public"."Payment" to "authenticated";

grant trigger on table "public"."Payment" to "authenticated";

grant truncate on table "public"."Payment" to "authenticated";

grant update on table "public"."Payment" to "authenticated";

grant delete on table "public"."Payment" to "service_role";

grant insert on table "public"."Payment" to "service_role";

grant references on table "public"."Payment" to "service_role";

grant select on table "public"."Payment" to "service_role";

grant trigger on table "public"."Payment" to "service_role";

grant truncate on table "public"."Payment" to "service_role";

grant update on table "public"."Payment" to "service_role";

grant delete on table "public"."Speech" to "anon";

grant insert on table "public"."Speech" to "anon";

grant references on table "public"."Speech" to "anon";

grant select on table "public"."Speech" to "anon";

grant trigger on table "public"."Speech" to "anon";

grant truncate on table "public"."Speech" to "anon";

grant update on table "public"."Speech" to "anon";

grant delete on table "public"."Speech" to "authenticated";

grant insert on table "public"."Speech" to "authenticated";

grant references on table "public"."Speech" to "authenticated";

grant select on table "public"."Speech" to "authenticated";

grant trigger on table "public"."Speech" to "authenticated";

grant truncate on table "public"."Speech" to "authenticated";

grant update on table "public"."Speech" to "authenticated";

grant delete on table "public"."Speech" to "service_role";

grant insert on table "public"."Speech" to "service_role";

grant references on table "public"."Speech" to "service_role";

grant select on table "public"."Speech" to "service_role";

grant trigger on table "public"."Speech" to "service_role";

grant truncate on table "public"."Speech" to "service_role";

grant update on table "public"."Speech" to "service_role";

grant delete on table "public"."Subscription" to "anon";

grant insert on table "public"."Subscription" to "anon";

grant references on table "public"."Subscription" to "anon";

grant select on table "public"."Subscription" to "anon";

grant trigger on table "public"."Subscription" to "anon";

grant truncate on table "public"."Subscription" to "anon";

grant update on table "public"."Subscription" to "anon";

grant delete on table "public"."Subscription" to "authenticated";

grant insert on table "public"."Subscription" to "authenticated";

grant references on table "public"."Subscription" to "authenticated";

grant select on table "public"."Subscription" to "authenticated";

grant trigger on table "public"."Subscription" to "authenticated";

grant truncate on table "public"."Subscription" to "authenticated";

grant update on table "public"."Subscription" to "authenticated";

grant delete on table "public"."Subscription" to "service_role";

grant insert on table "public"."Subscription" to "service_role";

grant references on table "public"."Subscription" to "service_role";

grant select on table "public"."Subscription" to "service_role";

grant trigger on table "public"."Subscription" to "service_role";

grant truncate on table "public"."Subscription" to "service_role";

grant update on table "public"."Subscription" to "service_role";

grant delete on table "public"."Transcript" to "anon";

grant insert on table "public"."Transcript" to "anon";

grant references on table "public"."Transcript" to "anon";

grant select on table "public"."Transcript" to "anon";

grant trigger on table "public"."Transcript" to "anon";

grant truncate on table "public"."Transcript" to "anon";

grant update on table "public"."Transcript" to "anon";

grant delete on table "public"."Transcript" to "authenticated";

grant insert on table "public"."Transcript" to "authenticated";

grant references on table "public"."Transcript" to "authenticated";

grant select on table "public"."Transcript" to "authenticated";

grant trigger on table "public"."Transcript" to "authenticated";

grant truncate on table "public"."Transcript" to "authenticated";

grant update on table "public"."Transcript" to "authenticated";

grant delete on table "public"."Transcript" to "service_role";

grant insert on table "public"."Transcript" to "service_role";

grant references on table "public"."Transcript" to "service_role";

grant select on table "public"."Transcript" to "service_role";

grant trigger on table "public"."Transcript" to "service_role";

grant truncate on table "public"."Transcript" to "service_role";

grant update on table "public"."Transcript" to "service_role";

grant delete on table "public"."User" to "anon";

grant insert on table "public"."User" to "anon";

grant references on table "public"."User" to "anon";

grant select on table "public"."User" to "anon";

grant trigger on table "public"."User" to "anon";

grant truncate on table "public"."User" to "anon";

grant update on table "public"."User" to "anon";

grant delete on table "public"."User" to "authenticated";

grant insert on table "public"."User" to "authenticated";

grant references on table "public"."User" to "authenticated";

grant select on table "public"."User" to "authenticated";

grant trigger on table "public"."User" to "authenticated";

grant truncate on table "public"."User" to "authenticated";

grant update on table "public"."User" to "authenticated";

grant delete on table "public"."User" to "service_role";

grant insert on table "public"."User" to "service_role";

grant references on table "public"."User" to "service_role";

grant select on table "public"."User" to "service_role";

grant trigger on table "public"."User" to "service_role";

grant truncate on table "public"."User" to "service_role";

grant update on table "public"."User" to "service_role";

grant delete on table "public"."WatchlistEntry" to "anon";

grant insert on table "public"."WatchlistEntry" to "anon";

grant references on table "public"."WatchlistEntry" to "anon";

grant select on table "public"."WatchlistEntry" to "anon";

grant trigger on table "public"."WatchlistEntry" to "anon";

grant truncate on table "public"."WatchlistEntry" to "anon";

grant update on table "public"."WatchlistEntry" to "anon";

grant delete on table "public"."WatchlistEntry" to "authenticated";

grant insert on table "public"."WatchlistEntry" to "authenticated";

grant references on table "public"."WatchlistEntry" to "authenticated";

grant select on table "public"."WatchlistEntry" to "authenticated";

grant trigger on table "public"."WatchlistEntry" to "authenticated";

grant truncate on table "public"."WatchlistEntry" to "authenticated";

grant update on table "public"."WatchlistEntry" to "authenticated";

grant delete on table "public"."WatchlistEntry" to "service_role";

grant insert on table "public"."WatchlistEntry" to "service_role";

grant references on table "public"."WatchlistEntry" to "service_role";

grant select on table "public"."WatchlistEntry" to "service_role";

grant trigger on table "public"."WatchlistEntry" to "service_role";

grant truncate on table "public"."WatchlistEntry" to "service_role";

grant update on table "public"."WatchlistEntry" to "service_role";


