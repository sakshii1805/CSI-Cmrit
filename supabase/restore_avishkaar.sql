-- Run once in Supabase -> SQL Editor. Puts the Avishkaar post (and its poster) back into the database.
-- It only inserts if it isn't there already, so running it twice is safe.

insert into public.events
  (slug, title, category, event_date, event_time, venue, description, image_url, organizer, highlights, status)
values (
  'avishkaar-2026',
  'AVISHKAAR: SIH-Pattern Hackathon',
  'Hackathon',
  '2026-10-09',
  'Preliminary: 26 Sept 2026 | Grand Finale: 9 – 10 Oct 2026',
  'CMR Institute of Technology (UGC Autonomous), Kandlakoya, Hyderabad',
  'AVISHKAAR is the flagship SIH-pattern hackathon organized by the Computer Society of India (CSI) CMRIT Student Chapter. Geared towards "Ideas, Code, Impact" and "Think, Build, Solve", teams of 6 CMRIT students will tackle 20 pre-selected problem statements across technology and real-world innovation.',
  '/images/avishkaar_poster.jpg',
  'CSI CMRIT Chapter & CMRIT (UGC Autonomous)',
  array[
    'Top 3 Cash Prizes: 1st Prize ₹20,000, 1st Runner-Up ₹10,000, 2nd Runner-Up ₹5,000 (Total ₹35,000 pool)',
    '20 Pre-selected Problem Statements across technology and innovation domains',
    'Preliminary Round: 26 September 2026 (Short 8-10 min presentation + Q&A)',
    'Grand Finale: 9 – 10 October 2026 (Only shortlisted teams advance)',
    'Registration Fee: ₹1,200 per team (Applicable only for shortlisted teams)',
    'Student Coordinators: B. Akshitha (+91 95734 69911) & Medi Sumeet (+91 80748 29165)',
    'Strict Anti-Plagiarism Policy: Copying solutions results in immediate disqualification'
  ],
  'published'
)
on conflict (slug) do nothing;

insert into public.highlights (title, category, event_date, caption, image_url, status)
select
  'Official AVISHKAAR 2026 Hackathon Poster',
  'Hackathons',
  '2026-09-22',
  'Full event poster: Preliminary Round on 26 Sept 2026, Grand Finale on 9-10 Oct 2026 with 20 pre-selected industry problem statements.',
  '/images/avishkaar_poster.jpg',
  'published'
where not exists (
  select 1 from public.highlights where image_url = '/images/avishkaar_poster.jpg'
);
