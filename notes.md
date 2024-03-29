Guide https://www.freecodecamp.org/news/the-complete-guide-to-full-stack-development-with-supabas/

How I made pantries table

```
CREATE TABLE pantries (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  title text,
  description text,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table pantries enable row level security;

create policy "Individuals can create pantries." on pantries for
    insert with check (auth.uid() = user_id);

create policy "Individuals can update their own pantries." on pantries for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own pantries." on pantries for
    delete using (auth.uid() = user_id);

create policy "Individuals view their own pantries." on pantries for
    select using (auth.uid() = user_id);
```

Guide on making recipes app https://stormotion.io/blog/how-to-build-a-cooking-or-recipe-app/

Design
https://dribbble.com/shots/6123164-Ultimate-pantry-management-app
https://dribbble.com/shots/4328363-Urban-Plate-Pantry-Page
https://dribbble.com/shots/3986717-Recipe-App-Products-list-pantry (with product scanner)
https://urbanplate.co/
https://dribbble.com/shots/4666898-Cooklist-App-Design (nice recipe page)
https://www.behance.net/gallery/129238371/Pantry-App-UI-Design (Full grocery management concept app)
https://dribbble.com/shots/11102515-Pet-Pantry (nice product entry form page)

Data
https://urbanplate.co/the-pantry/
https://www.thisisyena.com/pandemicpantry
