import { Plus, ChevronRight, TrendingUp, Target, Wallet } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const totalSaved =
    goals?.reduce(
      (acc, goal) => acc + (Number(goal.current_amount) || 0),
      0
    ) || 0

  const activeGoalsCount =
    goals?.filter((g) => g.status === 'active').length || 0

  const completedGoals =
    goals?.filter((g) => g.status === 'completed').length || 0

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 p-6 pb-24">

      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm font-medium">
            Welcome back,
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            {user?.user_metadata?.full_name?.split(' ')[0] || 'User'} 👋
          </h1>
        </div>

        <div className="w-10 h-10 bg-slate-100 rounded-full shadow-sm overflow-hidden">
          <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold uppercase">
            {user?.user_metadata?.full_name?.[0] ||
              user?.email?.[0]}
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-3">
            <Wallet className="text-emerald-500" />
            <div>
              <p className="text-sm text-slate-500">
                Total Savings
              </p>
              <h3 className="text-lg font-bold">
                XAF {totalSaved.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-3">
            <Target className="text-blue-500" />
            <div>
              <p className="text-sm text-slate-500">
                Active Goals
              </p>
              <h3 className="text-lg font-bold">
                {activeGoalsCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-purple-500" />
            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>
              <h3 className="text-lg font-bold">
                {completedGoals}
              </h3>
            </div>
          </div>
        </div>

      </div>


      {/* Balance Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-lg">

        <p className="text-sm opacity-80">
          Total Savings
        </p>

        <h2 className="text-4xl font-bold mt-2 mb-6">
          XAF {totalSaved.toLocaleString()}
        </h2>

        <div className="flex gap-4">

          <Link
            href="/goals/new"
            className="flex-1 bg-white text-emerald-600 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <Plus size={18} />
            New Goal
          </Link>

          <button className="flex-1 bg-emerald-700 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold">
            <TrendingUp size={18} />
            Insights
          </button>

        </div>

      </div>


      {/* Goals Section */}
      <section>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Active Goals
          </h3>

          <Link
            href="/goals"
            className="text-emerald-600 text-sm font-semibold flex items-center"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {goals?.map((goal) => {
            const progress = Math.min(
              (goal.current_amount / goal.target_amount) * 100,
              100
            )

            return (
              <Link
                key={goal.id}
                href={`/goals/${goal.id}`}
                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition"
              >

                <div className="flex justify-between mb-3">
                  <h4 className="font-semibold">
                    {goal.title}
                  </h4>

                  <span className="text-sm font-bold text-slate-500">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full mb-3">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <p className="font-bold">
                    XAF {goal.current_amount.toLocaleString()}
                  </p>

                  <p className="text-slate-400">
                    {goal.target_amount.toLocaleString()}
                  </p>
                </div>

              </Link>
            )
          })}

        </div>

      </section>


      {/* Quick Deposit */}
      <section>

        <h3 className="text-lg font-bold mb-4">
          Quick Deposit
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2">

          {goals?.map((goal) => (
            <Link
              key={goal.id}
              href={`/deposit/${goal.id}`}
              className="px-5 py-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl font-semibold whitespace-nowrap"
            >
              + {goal.title}
            </Link>
          ))}

        </div>

      </section>

    </div>
  )
}
