-- Update users to Pro role
UPDATE public.user_roles 
SET role = 'pro'::app_role 
WHERE user_id IN (
  SELECT p.id 
  FROM public.profiles p 
  WHERE p.email IN (
    'leon.hardwick@cardiffgiantholdings.com',
    'shevon@ymail.com', 
    'shevon166@gmail.com',
    'mattias116600@gmail.com',
    'ricardo.fm.pereira@gmail.com',
    'oiltrader093@gmail.com',
    'mutafchiev@yahoo.com',
    'kiranmaroj@gmail.com',
    'jasper@jalinmedia.nl',
    'ianfaler2@gmail.com',
    'leon.hardwick@handshakr.com'
  )
);